// src/controllers/worker.js
import axios from 'axios';
import {  Worker } from 'bullmq';
import IORedis from 'ioredis';
import { CheckResult } from '../models/checkResultModel.js';
import { Monitor } from '../models/monitorModel.js';
import {Incident} from '../models/incidentModel.js'
import { connectDB } from '../lib/db.js';
import { Queue } from 'bullmq';

const myQueue = new Queue('notificationQueue', {
  connection: {
    host: '127.0.0.1',
    port: 6379
  }
});

await connectDB();
const connection = new IORedis({ maxRetriesPerRequest: null });
let i=1;

const worker = new Worker('monitorQueue',async job => {
    // fetch monitors
    const {monitorId, url, userId, timeoutMs, intervalSeconds} = job.data;

    // http req with timeout
    const reqStart= Date.now();
    try{
      console.log(`👷 Worker PID ${process.pid} processing ${url} number${i++}`)

      const response = await axios.get(url, {timeout: timeoutMs});
      const responseTime = Date.now() - reqStart;
      const success = response.status >= 200 && response.status < 300;
      

      await CheckResult.create({
      monitorId,
      statusCode: response.status,
      responseTime,
      success,
      errorMessage:null      
      })

      // will update isProcessing and lastCheckedAt and nextCheckAt
      await Monitor.findByIdAndUpdate(monitorId ,{
      isProcessing: false,
      lastStatus: "UP",
      lastCheckedAt: new Date(),
      failureCount: 0,
      nextCheckAt: new Date(Date.now() + intervalSeconds * 1000)
      })

      console.log("Monitor ",  url, "is UP and running")

      // check if this was an incident, if yes then resolve it
      // check if there was an ongoing incident
      const existingIncident = await Incident.findOne({
        monitorId,
        status: "ONGOING"
      })

      if (existingIncident) {
        existingIncident.endTime = new Date()
        existingIncident.status = "RESOLVED"
        await existingIncident.save()

        console.log("Incident RESOLVED for", url)

        //recovery notification later
        await myQueue.add('sendEmail', {
          userId,
          type: "RECOVERY",
          monitorId,
          url
        },{
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000
          }
        })
      }
    }
    catch (err){
      const responseTime = Date.now() - reqStart;

      await CheckResult.create({
      monitorId,
      responseTime,
      success: false,
      statusCode: err.response?.status || null,
      errorMessage:err.message      
      })

      // will update isProcessing and lastCheckedAt and nextCheckAt
      const updated = await Monitor.findByIdAndUpdate(
        monitorId,
        {
          isProcessing: false,
          lastStatus: "DOWN",
          lastCheckedAt: new Date(),
          nextCheckAt: new Date(Date.now() + intervalSeconds * 1000),
          $inc: { failureCount: 1 }
        },
        { new: true }
      )

      console.log("Monitor ",  url, "is DOWN")    

      // create incidents
        // send notification inside incidents
      const failureCount = updated.failureCount

      if (failureCount >= 3) {
        const existingIncident = await Incident.findOne({
          monitorId,
          status: "ONGOING"
        })
      
        if (!existingIncident) {
          await Incident.create({
            monitorId,
            startTime: new Date(),
            status: "ONGOING"
          })
          console.log("Incident CREATED for", url)

          // send incident created email
          await myQueue.add('sendEmail', {
          userId,
          type: "INCIDENT",
          monitorId,
          url
          }, {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000
            }
          })
        }
      }
    }
    console.log("monitor checked:", url)
  },
  { connection }  
);

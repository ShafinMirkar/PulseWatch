// src/controllers/worker.js
import axios from 'axios';
import {  Worker } from 'bullmq';
import IORedis from 'ioredis';
import { CheckResult } from '../models/checkResultModel.js';
import { Monitor } from '../models/monitorModel.js';
import { connectDB } from '../lib/db.js';

await connectDB();
const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker('monitorQueue',async job => {
    // fetch monitors
    const {monitorId, url, userId, timeoutMs, intervalSeconds} = job.data;
    console.log(monitorId);
    console.log(url);
    console.log(userId);
    console.log(timeoutMs);
    console.log(intervalSeconds);

    // http req with timeout
    const reqStart= Date.now();
    try{
      console.log("TRY block entered for:", url)
      const response = await axios(url, {timeout: timeoutMs});
      const responseTime = Date.now() - reqStart;
      console.log("responseTime ", responseTime)
      const success = response.status >= 200 && response.status < 300;

      await CheckResult.create({
      monitorId,
      statusCode: response.status,
      responseTime,
      success,
      errorMessage:null      
      })

      // wiol update isProcessing and lastCheckedAt and nextCheckAt
      await Monitor.findByIdAndUpdate(monitorId ,{
      isProcessing: false,
      lastStatus: "UP",
      lastCheckedAt: new Date(),
      nextCheckAt: new Date(Date.now() + intervalSeconds * 1000)
      })

      console.log("Monitor ",  url, "is UP and running")
    }
    catch (err){
      const responseTime = Date.now() - reqStart;

      await CheckResult.create({
      monitorId,
      responseTime,
      success: false,
      errorMessage:err.message      
      })

      // wiol update isProcessing and lastCheckedAt and nextCheckAt
      await Monitor.findByIdAndUpdate(monitorId ,{
      isProcessing: false,
      lastStatus: "DOWN",
      lastCheckedAt: new Date(),
      nextCheckAt: new Date(Date.now() + intervalSeconds * 1000)
      })

      console.log("Monitor ",  url, "is DOWN")      
    }
    console.log("monitor checked:", url)
  },
  { connection , concurrency: 1}  
);
// src/controllers/scheduler.js
import cron from 'node-cron'
import { Queue } from 'bullmq';
import { Monitor } from '../models/monitorModel.js';
import { connectDB } from '../lib/db.js';

await connectDB();

const myQueue = new Queue('monitorQueue', {
  connection: {
    host: '127.0.0.1',
    port: 6379
  }
}
);

cron.schedule("*/5 * * * * *", async () => {
    // fetch due monitors
    const dueMonitors = await Monitor.find({
      nextCheckAt: { $lte: new Date() },
      isActive: true,
      isProcessing: { $ne: true }
    }).limit(10);
    console.log(dueMonitors.url); 

    // create and push jobs
    if(dueMonitors.length > 0){
        for (const ele of dueMonitors) {
          await Monitor.findByIdAndUpdate(ele._id, {
              isProcessing: true
          })
          await myQueue.add('checkResult',{
            monitorId: ele._id,
            url: ele.url,
            userId: ele.userId,
            timeoutMs: ele.timeoutMs,
            intervalSeconds: ele.intervalSeconds,
            failureCount: ele.failureCount,
          },{
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000
            }
          }
        )
        }
    }
});
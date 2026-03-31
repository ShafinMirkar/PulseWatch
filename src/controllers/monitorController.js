import prisma from '../lib/prisma.js'
import cron from 'node-cron';

async function createMonitor(req, res) {
    const {user_id, url, interval} = req.body;
    const user = await prisma.user.findUnique({
      where: { id: user_id }
    })
    if(!user){
        throw new Error("User Doesn't exists");
    }
    if(!url || !interval){
        throw new Error("URL and interval are required");
    }
    const monitor = await prisma.monitor.create({
      data: {
        url,
        intervalSeconds: interval,
        user
      }
    })

    // first check
    checkResult(monitor);

    cron.schedule("* * * * *", checkResult(monitor));
}
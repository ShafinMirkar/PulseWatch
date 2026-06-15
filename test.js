import { connectDB } from "./src/lib/db.js"
import { Monitor } from "./src/models/monitorModel.js"

await connectDB()

// const moniotrs = await Monitor.find()
// console.log(moniotrs.length)

const urls = [
  "https://google.com",
  "https://github.com",
  "https://openai.com",
  "https://stackoverflow.com",
  "https://amazon.com",
  "https://netflix.com",
  "https://example.com",
  "https://httpstat.us/200",
  "https://httpstat.us/500",
  "https://httpstat.us/404"
]

const users = [
  "69cb5d1755f0b41a27a8c503",
  "69cb61ed7023ca9e3955ada9",
  "69cb61ed7023ca9e3955adaa"
]

// helper
const random = (arr) => arr[Math.floor(Math.random() * arr.length)]

const monitors = []

for (let i = 0; i < 300; i++) {
  monitors.push({
    userId: random(users),
    url: `${random(urls)}?v=${i}`,
    timeoutMs: 5000,
    notifyEmail: true,
    notifySMS: false,
    intervalSeconds: Math.floor(Math.random() * 60) + 10, // 10–70 sec
    method: "GET",
    expectedStatus: 200,
    isActive: true,
    isProcessing: false,
    nextCheckAt: new Date(Date.now() - Math.random() * 60000), // already due
    createdAt: new Date()
  })
}


await Monitor.insertMany(monitors, {ordered: false})
console.log(`🔥 Created ${monitors.length} monitors`)

process.exit(0)
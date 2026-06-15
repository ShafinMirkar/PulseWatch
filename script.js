import { connectDB } from "./src/lib/db.js"
import { User } from "./src/models/userModel.js"
import { Monitor } from "./src/models/monitorModel.js"

await connectDB()

// 🧹 Clean DB

console.log("🧹 Database cleared")

// 👥 Create users
const users = await User.insertMany([
  {
    name: "Shafin 1",
    email: "shafinmirkar2@gmail.com"
  },
  {
    name: "Sam",
    email: "shafinmirkar@gmail.com"
  },
  {
    name: "Alex",
    email: "shafintmirkar@gmail.com"
  }
])

console.log("👥 Users created")

// helper
const now = Date.now()
const seconds = (s) => new Date(now + s * 1000)

await Monitor.create({
    userId: "69cd19cd45f7ac587c10f328",
    url: "https://google.com", // always UP
    intervalSeconds: 20,
    nextCheckAt: seconds(-5),
    failureCount: 0
})

console.log("🌐 Monitors created")

process.exit(0)
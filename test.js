// import { connectDB } from "./src/lib/db.js"
// import { Monitor } from "./src/models/monitorModel.js"

import { connectDB } from "./src/lib/db.js"
import { CheckResult } from "./src/models/checkResultModel.js"

// await connectDB()
// const monitors = await Monitor.find({
//     isProcessing: true
// })
// for (const ele of monitors) {
//     await Monitor.findByIdAndUpdate(ele._id, {
//         isProcessing: false
//     })
// }
// console.log(monitors.length)
// process.exit(0)


// import axios from 'axios';

// async function main(){
//   const reqStart= Date.now();
// const response = await axios.get("https://google.com");
// const responseTime = Date.now() - reqStart;
// console.log(responseTime)
// }

// await main()


await connectDB()
const results = await CheckResult.find();
console.log(results.length);
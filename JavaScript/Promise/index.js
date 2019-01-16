var Promise = require('./promise/promise')

// const p = new Promise((resolve, reject)=>{
//   setTimeout(()=>{resolve(1)}, 2000)
// })

// p.then(res=>{
//   console.log(res)
//   return 2
// }).then(res=>{
//   console.log(res)
//   return 3
// }).then(res=>{
//   console.log(res)
//   return 4
// })


Promise.resolve(1)

module.exports = Promise
const catchReject = () => new Promise((resolve, reject) => {
  reject(1)
})


catchReject().then(data => {
  console.log(data);
}, error => {
  console.log('reject', error)
}).catch(err => {
  console.log('catch', err)
})
const timers = []

function fakeSetInterval(callback, interval) {
  callback()
  const timer = setTimeout(() => {
    fakeSetInterval(callback, interval)
  }, interval)

  return timer
}

function clearFakeInterval(id) {
  timers.forEach(id => {
    clearTimeout(id)
  })

}
const timer = fakeSetInterval(() => {
  console.log(new Date())
}, 1000)

timers.push(timer)

setTimeout(() => {
  console.log('clear timeout')
  clearFakeInterval()
}, 5000)
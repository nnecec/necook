function factorialRecursive(number: number) {
  return number > 1 ? number * factorialRecursive(number - 1) : 1;
}

function factorialRecursiveOptimize(number: number, total: number = 1) {
  return number > 1 ? factorialRecursiveOptimize(number - 1, number * total) : total
}

console.log(factorialRecursive(10))
console.log(factorialRecursiveOptimize(10))
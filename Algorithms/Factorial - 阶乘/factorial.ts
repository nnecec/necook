
/**
 * 循环阶乘
 *
 * @param {number} number
 * @returns
 */
function factorial(number: number) {
  let result = 1;

  for (let i = 2; i <= number; i += 1) {
    result *= i;
  }

  return result;
}
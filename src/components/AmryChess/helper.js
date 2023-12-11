export function parseChar(char, flag) {
  const withFlag = char.length === 2 && /^[+-]$/.test(char[0])
  
  if (flag === void 0) {
    if (withFlag) {
      flag = char[0] === '+'
    } else {
      flag = true
    }
  }

  if (withFlag) {
    char = char[1]
  }
  
  return {
    char,
    flag
  }
}

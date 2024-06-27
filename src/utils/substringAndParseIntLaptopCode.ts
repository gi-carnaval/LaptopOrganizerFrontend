export const substringAndParseInt = (laptopCodeString: string = "") => {
  return parseInt(laptopCodeString.substring(0, 7))
}
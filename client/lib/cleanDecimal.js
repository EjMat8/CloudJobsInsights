export default function cleanDecimal(value) {
  const num = parseFloat(value);
  if (num % 1 !== 0 && value.split(".")[1]?.length > 1) {
    return num.toFixed(1);
  }
  return value;
}

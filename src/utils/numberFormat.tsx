
const numberFormat = (num: number) => {
  if(num < 1000){
      return num
  } else if (num < 1000000) {
      return (num/1000).toFixed(2) + 'K'
  } else if (num < 1000000000) {
      return (num/1000000).toFixed(2) + 'M'
  } else if (num < 1000000000000) {
      return (num/1000000000).toFixed(2) + 'B'
  } else if (num >= 1000000000000) {
      return (num/1000000000000).toFixed(2) + 'T'
  }
}

export default numberFormat
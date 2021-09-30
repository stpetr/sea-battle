export const copy = (text) => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    alert(`Your browser does not support copying to clipboard`)
  }
}

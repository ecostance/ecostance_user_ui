export default function _debounce(callback, time) {
  let timer
  return (...args) => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      callback(...args)
    }, time || 3000)
  }
}

export function _newDebounce() {
  let timer
  const setDebounce = (callback, time) => {
    return (...args) => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        callback(...args)
      }, time || 3000)
    }
  }
  const removeDebounce = () => {
    clearTimeout(timer)
  }

  return { setDebounce, removeDebounce }
}

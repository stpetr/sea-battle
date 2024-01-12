import React, { useEffect, useState } from 'react'

const LOADER_TIMEOUT = 400
const LOADER_DOTS_NUM = 3

export const Loader = () => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevState) => {
        if (prevState.length >= LOADER_DOTS_NUM) {
          return ''
        }
        return prevState + '.'
      })
    }, LOADER_TIMEOUT)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="loader">
      <span className="loader__text">Loading<span className="loader__text-dots">{dots}</span></span>
    </div>
  )
}

export default Loader

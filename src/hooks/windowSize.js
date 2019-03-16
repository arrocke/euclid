import { useState, useEffect } from 'react'

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight
})

const useWindowSize = () => {
  const [size, setSize] = useState(getSize())

  useEffect(() => {
    const resize = () => setSize(getSize())
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return size
}

export default useWindowSize
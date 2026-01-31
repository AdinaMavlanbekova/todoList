import { useEffect, useRef, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [ value,setValue ] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    try {
      localStorage.setItem(key, JSON.stringify(value))
    }catch {

    }
  }, [key, value])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      setValue(raw ? (JSON.parse(raw) as T): initialValue)
    } catch {
      setValue(initialValue)
    }
  }, [key])
  return [value, setValue] as const
}
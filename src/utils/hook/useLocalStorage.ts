import { useEffect, useState, useRef } from "react"



export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const skipWriteRef = useRef(false)

  const readValue = (): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  }

  const [ storedValue, setStoredValue ] = useState<T>(() => readValue())

  useEffect(() => {
    skipWriteRef.current = true
    setStoredValue(readValue())
  }, [key])

  useEffect(() => {
    if (skipWriteRef.current) {
      skipWriteRef.current = false
      return
    }

    try {
      localStorage.setItem(key, JSON.stringify(storedValue))

      window.dispatchEvent(new CustomEvent('tasks-updated', {detail: {key}}))
    } catch {
      //ignore
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}
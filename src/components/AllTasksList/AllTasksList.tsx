import { FC, useEffect, useMemo, useState } from "react"


type Task = {
  id: string
  text: string
  time?: string
  done: boolean
}

type TaskRow = Task & {day: string}

const TASKS_PREFIX = 'tasks:'

function parseDayFromKey(key: string) {
  return key.slice(TASKS_PREFIX.length)
}

function toSortableTime(t?: string) {
  return t ?? '99:99'
}

export const AllTasksList: FC = () => {
  const [rows, setRows] = useState<TaskRow[]>([])

  const load = () => {
    const all: TaskRow[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith(TASKS_PREFIX)) continue

      const day = parseDayFromKey(key)

      try {
        const raw = localStorage.getItem(key)
        const tasks = raw ? (JSON.parse(raw) as Task[]) : []

        tasks.forEach((t) => {
          all.push({...t, day})
        })
      } catch {
        // ignore broken json
      }
    }
    setRows(all)
  }

  useEffect(() => {
    load()
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith(TASKS_PREFIX)) load()
    }

    const onFocus = () => load()

    const onTasksUpdated = () => load()

    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    window.addEventListener('tasks-updated', onTasksUpdated as EventListener)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('tasks-updated', onTasksUpdated as EventListener)
    }
  }, [])

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      if (a.day !== b.day) return a.day.localeCompare(b.day)
      return toSortableTime(a.time).localeCompare(toSortableTime(b.time))
    })
  }, [rows])

  const toggleTask = (day: string, id: string) => {
    const key = `${TASKS_PREFIX}${day}`

    try {
      const raw = localStorage.getItem(key)
      if (!raw) return

      const tasks = JSON.parse(raw) as Task[]
      const next = tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )

      localStorage.setItem(key, JSON.stringify(next))
      window.dispatchEvent(new CustomEvent('tasks-updated', { detail: { key } }))
    } catch {
      // ignore
    }
  }

  const deleteTask = (day: string, id: string) => {
    const key = `${TASKS_PREFIX}${day}`

    try {
      const raw = localStorage.getItem(key)
      if (!raw) return

      const tasks = JSON.parse(raw) as Task[]
      const next = tasks.filter((t) => t.id !== id)

      if (next.length === 0) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(next))
      }

      window.dispatchEvent(new CustomEvent('tasks-updated', { detail: { key } }))
    } catch {
      // ignore
    }
  }


  return (
    <div>
      <h2>Все задачи</h2>

      {sorted.length === 0 ? (
        <div>Пока нет задач</div>
      ) : (
        <ul>
          {sorted.map((t) => (
            <li key={`${t.day}:${t.id}`}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span>{t.day}</span>
                <span>{t.time ?? '-'}</span>
                <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
                  {t.text}
                </span>
                <input 
                  type="checkbox" 
                  checked={t.done}
                  onChange={() => toggleTask(t.day, t.id)}
                  title='Отметить выполненной'
                />

                <button
                  onClick={() => deleteTask(t.day, t.id)}
                  title='Удалить задачу'
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
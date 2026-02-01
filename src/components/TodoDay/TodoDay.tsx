import { FC, useState } from 'react'
import { useReminder } from '../../utils/hook/useReminder'
import { useLocalStorage } from '../../utils/hook/useLocalStorage';
import styles from './TodoDay.module.scss'


type Task = {
  id: string;
  text: string;
  time?: string;   
  done: boolean;
};

type Props = {
  day: string;
}

export const TodoDay:FC<Props> = ({ day }) => {

  const storageKey = `tasks:${day}`
  const [tasks, setTasks] = useLocalStorage<Task[]>(storageKey, [])
  const [input, setInput] = useState('')
  const [time, setTime] = useState('')

  const addTask = () => {
    const text = input.trim() 
    if (!text) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      time: time || undefined,
      done: false
    };
    setTasks([...tasks, newTask])
    setInput('')
    setTime('')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t: Task) => (t.id === id ? {...t, done: !t.done} : t)))
  }

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  useReminder(tasks);

  return (
    <div>
      <h2>Задачи на {day}</h2>
      <div>
        <input 
          type="text" 
          placeholder='Новая задача'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input 
          type="time" 
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={addTask}>Добавить</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={styles.card}>
            <input 
              type="checkbox" 
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              title='Отметить выполненной'
            />
            <div>
              <div>
                {task.text}
              </div>
              <div>
                {task.time ? `${task.time}` : '-'}
              </div>
            </div>
            <button onClick={() => removeTask(task.id)} title='Удалить'>Удалить</button>
          </li>
        ))}
        {tasks.length === 0 && <li>Пока задач нет — добавь первую выше</li>}
      </ul>
    </div>
  )
}
import { type FC, useMemo, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { TodoDay } from '../TodoDay/TodoDay'
import styles from './CalendarPage.module.scss'


export const CalendarPage:FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const day = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate])
  

  return(
    <div className={styles.container}>
      <div>
        <h1>Календарь задач</h1>
        <Calendar 
          value={selectedDate}
          onChange={(v) => {
            const d = Array.isArray(v) ? v[0] : v
            if (d) setSelectedDate(d)
          }}
          onClickDay={(d) => setSelectedDate(d)}
        />
      </div>
      <div>
        <TodoDay day={day} />
      </div>
    </div>
  )
}
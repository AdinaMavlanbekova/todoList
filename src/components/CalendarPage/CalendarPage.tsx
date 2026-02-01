import { type FC, useMemo, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { TodoDay } from '../TodoDay/TodoDay'
import styles from './CalendarPage.module.scss'
import { AllTasksList } from '../AllTasksList/AllTasksList'
import { formatLocalDay } from '../../utils/helpers/formatLocalDay'


export const CalendarPage:FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const day = useMemo(() => formatLocalDay(selectedDate), [selectedDate])
  

  return(
    <div className={styles.container}>
      <div>
        <h1>Календарь задач</h1>
        <Calendar 
          value={selectedDate}
          onClickDay={(d) => {
            setSelectedDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
          }}
        />
      </div>
      <div className={styles.right}>
        <div className={styles.col}>
          <TodoDay key={day} day={day} />
        </div>
        <div className={styles.col}>
          <AllTasksList />
        </div>
      </div>
    </div>
  )
}
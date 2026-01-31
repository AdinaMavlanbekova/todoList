import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CalendarPage } from './components/CalendarPage/CalendarPage'

export const App =()=> {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  )
}
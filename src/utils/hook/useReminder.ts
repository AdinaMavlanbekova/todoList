import { useEffect, useRef } from 'react'


type Task = {
  id: string;
  text: string;
  time?: string;
  done: boolean;
};

export const useReminder = (tasks: Task[]) => {
  const playedFor = useRef<Set<string>>(new Set())

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;

    const ensureAudio = () => {
      if (!audio) audio = new Audio('/notify.mp3')
      return audio
    }

    const tick = () => {
      const now = new Date()
      const current = now.toTimeString().slice(0, 5)

      tasks.forEach((t) => {
        if (!t.time || t.done) return
        const key = `${t.id}@${current}`
        if (t.time === current && !playedFor.current.has(key)) {
          ensureAudio().play().catch(() => {

          });
          alert(`Напоминание: ${t.text} — ${t.time}`)
          playedFor.current.add(key)
        }
      })
    }

  tick();
  const interval = setInterval(tick, 60000)

    return () => clearInterval(interval)
  }, [tasks])

}
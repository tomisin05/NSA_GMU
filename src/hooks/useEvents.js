import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  const addEvent = (data) =>
    addDoc(collection(db, 'events'), { ...data, clicks: 0, createdAt: serverTimestamp() })

  const updateEvent = (id, data) =>
    updateDoc(doc(db, 'events', id), data)

  const deleteEvent = (id) =>
    deleteDoc(doc(db, 'events', id))

  const trackClick = async (id) => {
    const event = events.find(e => e.id === id)
    if (event) {
      await updateDoc(doc(db, 'events', id), { clicks: (event.clicks || 0) + 1 })
    }
  }

  return { events, loading, addEvent, updateEvent, deleteEvent, trackClick }
}

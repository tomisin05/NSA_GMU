import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'

export function useLinks() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'links'), orderBy('order', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setLinks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  const addLink = (data) =>
    addDoc(collection(db, 'links'), { ...data, clicks: 0, createdAt: serverTimestamp() })

  const updateLink = (id, data) =>
    updateDoc(doc(db, 'links', id), data)

  const deleteLink = (id) =>
    deleteDoc(doc(db, 'links', id))

  const trackClick = (id) =>
    updateDoc(doc(db, 'links', id), {
      clicks: (links.find(l => l.id === id)?.clicks || 0) + 1
    })

  return { links, loading, addLink, updateLink, deleteLink, trackClick }
}

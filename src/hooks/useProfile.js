import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const DEFAULT_PROFILE = {
  name: 'Nigerian Student Association',
  handle: '@nsa_official',
  bio: 'Celebrating Nigerian culture, fostering community, and empowering students through education, networking & unforgettable events. 🌍✨',
  instagram: '',
  twitter: '',
  facebook: '',
  whatsapp: '',
  youtube: '',
  email: '',
}

export function useProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'profile'), (snap) => {
      if (snap.exists()) {
        setProfile({ ...DEFAULT_PROFILE, ...snap.data() })
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const updateProfile = (data) =>
    setDoc(doc(db, 'settings', 'profile'), data, { merge: true })

  return { profile, loading, updateProfile }
}

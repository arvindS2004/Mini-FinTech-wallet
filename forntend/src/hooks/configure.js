import { useEffect, useState } from 'react'
import { api } from '../api'

export default function useConfig() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/config').then(r => setConfig(r.data)).finally(() => setLoading(false))
  }, [])
  return { config, loading }
}

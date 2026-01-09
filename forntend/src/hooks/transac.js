import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import dayjs from 'dayjs'

export default function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = async () => {
    setLoading(true)
    try {
      const [txRes, usersRes] = await Promise.all([
        api.get('/transactions?_sort=createdAt&_order=desc'),
        api.get('/users')
      ])

      setTransactions(txRes.data)
      setUsers(usersRes.data)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const balance = useMemo(() => {
    return transactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => {
        if (t.type === 'credit') return sum + t.amount
        if (t.type === 'debit' || t.type === 'fee') return sum - t.amount
        return sum
      }, 0)
  }, [transactions])

  const createTransaction = async (tx) => {
    const res = await api.post('/transactions', {
      ...tx,
      status: 'pending',
      createdAt: dayjs().toISOString()
    })
    return res.data
  }

  const updateStatus = async (id, status, reason) => {
    await api.patch(`/transactions/${id}`, { status, reason })
    refresh()
  }

  const softDelete = async (id) => {
    await api.patch(`/transactions/${id}`, { deleted: true })
    refresh()
  }

  return {
    transactions,
    users,
    balance,
    loading,
    error,
    refresh,
    createTransaction,
    updateStatus,
    softDelete
  }
}
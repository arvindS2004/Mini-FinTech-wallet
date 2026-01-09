import { useState } from 'react'
import './Actions.css'

export function Loading() {
  return (
    <div className="loading-screen">
      <div className="spinner">
        <div></div><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div><div></div>
      </div>
    </div>
  )
}

export function ErrorState({ message }) {
  return <div className="error">{message}</div>
}

export function AddMoney({ onSubmit }) {
  const [amount, setAmount] = useState('')

  const handle = (e) => {
    e.preventDefault()
    const numAmount = Number(amount)

    if (numAmount <= 0) {
      alert('Please enter a positive amount')
      return
    }

    onSubmit(numAmount)
    setAmount('')
  }

  return (
    <div className='add-money-container'>
      <h3>Add Money</h3>
      <input
        type="number"
        required
        value={amount}
        onChange={e => setAmount(e.target.value)}
        min="0.01"
        step="0.01"
        placeholder="Enter amount"
      />
      <button onClick={handle}>Add</button>
    </div>
  )
}

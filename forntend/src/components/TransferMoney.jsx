import { useState, useMemo } from 'react'
import './tm.css'

export default function TransferMoney({ users, config, balance, onSubmit }) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')

  const numericAmount = Number(amount) || 0
  const fee = useMemo(() => (numericAmount * config.feePercent) / 100, [numericAmount, config])
  const total = numericAmount + fee

  const openConfirm = (e) => {
    e.preventDefault()
    setError('')

    if (!recipient) return setError('Select a recipient')
    if (!numericAmount || numericAmount <= 0) return setError('Enter valid amount')
    if (numericAmount > config.maxTransactionAmount) return setError(`Max allowed is ${config.maxTransactionAmount}`)
    if (total > balance) return setError(`Insufficient balance`)

    setConfirming(true)
  }

  const submit = () => {
    onSubmit({
      recipientId: Number(recipient),
      amount: numericAmount,
      fee
    })
    setRecipient('')
    setAmount('')
    setConfirming(false)
  }

  return (
    <div className="transfer-container">
      <h3>Transfer Money</h3>

      <select value={recipient} onChange={e => setRecipient(e.target.value)}>
        <option value="">Select Recipient</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Enter amount"
      />

      <div>Fee: {fee.toFixed(2)}</div>
      <div>Total: {total.toFixed(2)}</div>
      <div>Balance: {balance.toFixed(2)}</div>

      {error && <div className="error">{error}</div>}

      <button onClick={openConfirm}>Transfer</button>

      {confirming && (
        <div className="modal">
          <div>
            <p>Amount: {numericAmount.toFixed(2)}</p>
            <p>Fee: {fee.toFixed(2)}</p>
            <p>Total: {total.toFixed(2)}</p>
            <button onClick={submit}>Confirm</button>
            <button onClick={() => setConfirming(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

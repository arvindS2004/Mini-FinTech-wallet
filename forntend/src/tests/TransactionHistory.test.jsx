import { render, screen, fireEvent } from '@testing-library/react'
import TransactionHistory from '../components/TransactionHistory'
import dayjs from 'dayjs'

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]

const transactions = [
  { id: 1, type: 'credit', amount: 500, status: 'success', createdAt: dayjs().subtract(2, 'day').toISOString() },
  { id: 2, type: 'debit', recipientId: 2, amount: 200, status: 'pending', createdAt: dayjs().subtract(1, 'day').toISOString() },
  { id: 3, type: 'debit', recipientId: 1, amount: 300, status: 'failed', createdAt: dayjs().toISOString() }
]

describe('TransactionHistory', () => {
  test('renders transactions', () => {
    render(
      <TransactionHistory transactions={transactions} users={users} onDelete={() => {}} />
    )

    expect(screen.getByText(/credit/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer to bob/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer to alice/i)).toBeInTheDocument()
  })

  test('filters by status', () => {
    render(
      <TransactionHistory transactions={transactions} users={users} onDelete={() => {}} />
    )

    fireEvent.change(screen.getByDisplayValue('All Status'), { target: { value: 'success' } })

    expect(screen.getByText(/credit/i)).toBeInTheDocument()
    expect(screen.queryByText(/transfer to bob/i)).toBeNull()
    expect(screen.queryByText(/transfer to alice/i)).toBeNull()
  })

  test('filters by date', () => {
    render(
      <TransactionHistory transactions={transactions} users={users} onDelete={() => {}} />
    )

    const fromDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    fireEvent.change(screen.getByPlaceholderText(/from date/i), { target: { value: fromDate } })

    expect(screen.queryByText(/credit/i)).toBeNull()
    expect(screen.getByText(/transfer to bob/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer to alice/i)).toBeInTheDocument()
  })

  test('shows empty state if no transactions', () => {
    render(
      <TransactionHistory transactions={[]} users={users} onDelete={() => {}} />
    )

    expect(screen.getByText(/no transactions found/i)).toBeInTheDocument()
  })

  test('calls onDelete on confirm', () => {
    const onDelete = jest.fn()
    window.confirm = jest.fn(() => true) // simulate confirm

    render(
      <TransactionHistory transactions={transactions} users={users} onDelete={onDelete} />
    )

    const deleteButtons = screen.getAllByText(/delete/i)
    fireEvent.click(deleteButtons[0])

    expect(onDelete).toHaveBeenCalledWith(1)
  })
})

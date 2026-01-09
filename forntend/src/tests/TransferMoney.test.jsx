import { render, screen, fireEvent } from '@testing-library/react'
import TransferMoney from '../components/TransferMoney'

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]

const config = {
  feePercent: 2,
  maxTransactionAmount: 10000
}

describe('TransferMoney', () => {
  test('renders transfer form', () => {
    render(
      <TransferMoney
        users={users}
        config={config}
        balance={5000}
        onSubmit={() => {}}
      />
    )

    expect(screen.getByText(/transfer money/i)).toBeInTheDocument()
    expect(screen.getByText(/balance/i)).toBeInTheDocument()
  })

  test('blocks transfer above max limit', () => {
    render(
      <TransferMoney
        users={users}
        config={config}
        balance={50000}
        onSubmit={() => {}}
      />
    )

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '1' }
    })

    fireEvent.change(screen.getByPlaceholderText(/enter amount/i), {
      target: { value: '20000' }
    })

    fireEvent.click(screen.getByRole('button', { name: /transfer/i }))

    expect(
      screen.getByText(/max allowed is 10000/i)
    ).toBeInTheDocument()
  })

  test('blocks transfer with insufficient balance', () => {
    render(
      <TransferMoney
        users={users}
        config={config}
        balance={100}
        onSubmit={() => {}}
      />
    )

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '2' }
    })

    fireEvent.change(screen.getByPlaceholderText(/enter amount/i), {
      target: { value: '200' }
    })

    fireEvent.click(screen.getByRole('button', { name: /transfer/i }))

    expect(
      screen.getByText(/insufficient balance/i)
    ).toBeInTheDocument()
  })

  test('submits transfer with correct fee', () => {
    const onSubmit = jest.fn()

    render(
      <TransferMoney
        users={users}
        config={config}
        balance={5000}
        onSubmit={onSubmit}
      />
    )

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '1' }
    })

    fireEvent.change(screen.getByPlaceholderText(/enter amount/i), {
      target: { value: '1000' }
    })

    fireEvent.click(screen.getByRole('button', { name: /transfer/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      recipientId: 1,
      amount: 1000,
      fee: 20
    })
  })
})

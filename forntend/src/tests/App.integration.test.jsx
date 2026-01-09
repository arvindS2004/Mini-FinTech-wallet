import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import { api } from '../api'

jest.mock('../api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn()
  }
}))

describe('Integration: Transfer Money Flow', () => {
  let transactions = []

  beforeEach(() => {
    jest.clearAllMocks()

    transactions = [
      {
        id: 'c1',
        type: 'credit',
        amount: 5000,
        status: 'success',
        createdAt: new Date().toISOString()
      }
    ]

    api.get.mockImplementation((url) => {
      if (url.startsWith('/transactions')) {
        return Promise.resolve({ data: transactions })
      }

      if (url === '/users') {
        return Promise.resolve({
          data: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
          ]
        })
      }

      if (url === '/config') {
        return Promise.resolve({
          data: {
            feePercent: 2,
            maxTransactionAmount: 10000
          }
        })
      }
    })

    api.post.mockImplementation((_url, body) => {
      const tx = {
        id: crypto.randomUUID(),
        ...body,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      transactions = [tx, ...transactions]
      return Promise.resolve({ data: tx })
    })

    api.patch.mockImplementation((url, body) => {
      const id = url.split('/').pop()
      transactions = transactions.map(t =>
        t.id === id ? { ...t, ...body } : t
      )
      return Promise.resolve({})
    })
  })

  test('user transfers money successfully and sees updated UI', async () => {
    render(<App />)

    await waitFor(() =>
      expect(screen.getByText(/welcome user/i)).toBeInTheDocument()
    )

    fireEvent.click(screen.getByText(/check balance/i))
    expect(screen.getByText(/₹ 5000.00/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/transfer/i))

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '2' }
    })

    fireEvent.change(screen.getByPlaceholderText(/enter amount/i), {
      target: { value: '1000' }
    })

    fireEvent.click(screen.getByRole('button', { name: /transfer/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    fireEvent.click(screen.getByText(/← back/i))

    await waitFor(() => {
      expect(screen.getByText(/transfer to bob/i)).toBeInTheDocument()
    })
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import { AddMoney } from '../components/Actions'

describe('AddMoney', () => {
  test('renders Add Money form', () => {
    render(<AddMoney onSubmit={() => {}} />)

    expect(screen.getByText(/add money/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter amount/i)).toBeInTheDocument()
  })

  test('submits valid amount', () => {
    const onSubmit = jest.fn()
    render(<AddMoney onSubmit={onSubmit} />)

    const input = screen.getByPlaceholderText(/enter amount/i)
    const button = screen.getByRole('button', { name: /^add$/i })

    fireEvent.change(input, { target: { value: '500' } })
    fireEvent.click(button)

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(500)
  })

  test('blocks invalid amount', () => {
    window.alert = jest.fn()

    const onSubmit = jest.fn()
    render(<AddMoney onSubmit={onSubmit} />)

    const input = screen.getByPlaceholderText(/enter amount/i)
    const button = screen.getByRole('button', { name: /^add$/i })

    fireEvent.change(input, { target: { value: '-10' } })
    fireEvent.click(button)

    expect(onSubmit).not.toHaveBeenCalled()
    expect(window.alert).toHaveBeenCalled()
  })
})

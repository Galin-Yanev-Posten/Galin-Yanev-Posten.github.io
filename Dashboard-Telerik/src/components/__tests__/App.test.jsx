import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import App from '../../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    // App renders routing, so we check for login page content
    expect(screen.getByText(/enter your login details/i)).toBeInTheDocument()
  })
})
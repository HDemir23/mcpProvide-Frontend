import { render, screen } from '@testing-library/react'
import Home from './page'

test('renders home page with layout', () => {
  render(<Home />)
  expect(screen.getByText('AI Agents')).toBeInTheDocument()
  expect(screen.getByText('Canvas Area')).toBeInTheDocument()
  expect(screen.getByText('Properties')).toBeInTheDocument()
})
import { render, screen } from '@testing-library/react'
import Layout from './Layout'

test('renders three-panel layout', () => {
  render(
    <Layout
      sidebar={<div>Sidebar Content</div>}
      canvas={<div>Canvas Content</div>}
      rightPanel={<div>Right Panel Content</div>}
    />
  )
  
  expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  expect(screen.getByText('Canvas Content')).toBeInTheDocument()
  expect(screen.getByText('Right Panel Content')).toBeInTheDocument()
})
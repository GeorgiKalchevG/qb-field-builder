import { describe, expect, it, vi } from 'vitest'
import { setup } from '../../tests/setup.ts'
import { Button } from './index.tsx'
import { screen } from '@testing-library/react'

describe('Button', () => {
    it('should render normal state', async () => {
        const mockOnClick = vi.fn()
        const { user } = setup(<Button onClick={mockOnClick}>test</Button>)
        const button = screen.getByRole('button', {
            name: /test/i
        })
        expect(button).toBeInTheDocument()
        await user.click(button)
        expect(mockOnClick).toHaveBeenCalled()
    });
    it('should render in disabled state when disabled prop is passed', async () => {
        const mockOnClick = vi.fn()
        const { user } = setup(<Button onClick={mockOnClick} disabled>Disabled button</Button>)
        const button = screen.getByRole('button', {
            name: /Disabled button/i
        })
        expect(button).toBeInTheDocument()
        await user.click(button)
        expect(mockOnClick).not.toHaveBeenCalled()
    });
    it('should render in loading state when loading prop is passed', async () => {
        const mockOnClick = vi.fn()
        const { user } = setup(<Button onClick={mockOnClick} loading>Loading button</Button>)
        const button = screen.getByRole('button', {
            name: /Loading button/i
        })
        expect(button).toBeInTheDocument()
        await user.click(button)
        expect(mockOnClick).not.toHaveBeenCalled()
    });
});
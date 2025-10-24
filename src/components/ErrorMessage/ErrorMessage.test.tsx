import { describe, expect, it } from 'vitest'
import { setup } from '../../tests/setup.ts'
import { ErrorMessage } from './index.tsx'
import { screen } from '@testing-library/react'

describe('ErrorMessage', () => {

    it('should render normal state for react hook form errors', async () => {
        setup(<ErrorMessage message='We have a problem' />)
        expect(screen.getByText("We have a problem")).toBeInTheDocument()
    });
    it('should not render when no error message is passed', async () => {
        const { container } = setup(<ErrorMessage />)
        expect(container).toBeEmptyDOMElement()
    });
});
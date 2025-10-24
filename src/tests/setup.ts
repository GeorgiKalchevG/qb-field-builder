import { afterEach } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { userEvent } from '@testing-library/user-event'
import * as React from 'react'

afterEach(() => {
    cleanup();
})

export function setup(jsx: React.ReactNode) {
    return {
        user: userEvent.setup(),
        // Import `render` from the framework library of your choice.
        // See https://testing-library.com/docs/dom-testing-library/install#wrappers
        ...render(jsx),
    }
}
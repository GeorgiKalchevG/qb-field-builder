import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import './index.css'
import App from './App.tsx'
import { SubmitButtonProvider } from './components/Button/ButtonContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary fallback={<h1>Something went wrong</h1>}>
            <QueryClientProvider client={queryClient}>
                <SubmitButtonProvider>
                    <App />
                </SubmitButtonProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    </StrictMode>,
)

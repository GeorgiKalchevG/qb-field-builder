import { afterEach, describe, expect, it, vi } from 'vitest'
import { setup } from '../../tests/setup.ts'
import { Fields } from './index.tsx'
import { cleanup, screen } from '@testing-library/react'

const mockDataValue = [
    { id: '1', choices: ['1', '2'], default: '1', label: 'label' },
    { choices: ['1', '2'], default: '1', label: 'missing id' }
]
const mockData = vi.fn().mockReturnValue(mockDataValue)
const mockedIsLoading = vi.fn().mockReturnValue(true)
const mockIsError = vi.fn().mockReturnValue(false)
const mocks = vi.hoisted(() => ({
    useExistingFields: vi.fn().mockImplementation(() => ({
        data: mockData(),
        isLoading: mockedIsLoading(),
        isError: mockIsError()
    }))
}))
vi.mock('../../api/fieldBuilderApi.ts', () => ({
    useExistingFields: mocks.useExistingFields
}))
describe('Button', () => {
    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
    it('should render error state when data is null(not expected behaviour)', async () => {
        const mockSetId = vi.fn()
        mockData.mockReturnValue(null)
        setup(<Fields id='1' setId={mockSetId} />)
        expect(screen.getByText('Error while fetching saved fields')).toBeInTheDocument()
    });
    it('should render error state when isError is true', async () => {
        const mockSetId = vi.fn()
        mockData.mockReturnValue(mockDataValue)
        mockIsError.mockReturnValue(true)
        setup(<Fields id='1' setId={mockSetId} />)
        expect(screen.getByText('Error while fetching saved fields')).toBeInTheDocument()
    });
    it('should render loading state when isLoading is true', async () => {
        const mockSetId = vi.fn()
        mockIsError.mockReturnValue(false)
        mockedIsLoading.mockReturnValue(true)
        setup(<Fields id='1' setId={mockSetId} />)
        expect(screen.getByText('Loading fields...')).toBeInTheDocument()
    });
    it('should render normal state when no preconfigured fields are available', async () => {
        const mockSetId = vi.fn()
        mockData.mockReturnValue([])
        mockIsError.mockReturnValue(false)
        mockedIsLoading.mockReturnValue(true)
        setup(<Fields id='1' setId={mockSetId} />)
        expect(screen.getByText('No Select fields available')).toBeInTheDocument()
    });
    it('should render normal state when  preconfigured fields are available', async () => {
        const mockSetId = vi.fn()
        mockData.mockReturnValue(mockDataValue)
        mockIsError.mockReturnValue(false)
        mockedIsLoading.mockReturnValue(true)
        setup(<Fields id='1' setId={mockSetId} />)
        const preConfigured = screen.getAllByRole('listitem').find(i => i.textContent === 'label')
        expect(preConfigured).toBeInTheDocument()
    });
    it('should select available preconfigured selectField', async () => {
        const mockSetId = vi.fn()
        mockData.mockReturnValue(mockDataValue)
        mockIsError.mockReturnValue(false)
        mockedIsLoading.mockReturnValue(true)
        const { user } = setup(<Fields id='1' setId={mockSetId} />)
        const preConfigured = screen.getAllByRole('listitem').find(i => i.textContent === 'label')
        expect(preConfigured).toBeInTheDocument()
        await user.click(preConfigured!)
        expect(mockSetId).toHaveBeenCalledWith("1")
    });
    it('should not select available preconfigured selectField if it\'s missing id', async () => {
        const mockSetId = vi.fn()
        mockData.mockReturnValue(mockDataValue)
        mockIsError.mockReturnValue(false)
        mockedIsLoading.mockReturnValue(true)
        const { user } = setup(<Fields id='1' setId={mockSetId} />)
        const withMissingId = screen.getAllByRole('listitem').find(i => i.textContent === 'missing id')
        expect(withMissingId).toBeInTheDocument()
        await user.click(withMissingId!)
        expect(mockSetId).not.toHaveBeenCalled()
    });
    it('should select creating new field', async () => {
        const mockSetIdx = vi.fn()
        mockData.mockReturnValue(mockDataValue)
        mockIsError.mockReturnValue(false)
        mockedIsLoading.mockReturnValue(true)
        const { user } = setup(<Fields id='1' setId={mockSetIdx} />)
        const preConfigured = screen.getByRole('button', {
            name: /New form/i
        })
        expect(preConfigured).toBeInTheDocument()
        await user.click(preConfigured)
        expect(mockSetIdx).toHaveBeenCalledWith(undefined)
    });
});
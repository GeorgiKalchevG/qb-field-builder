import { CustomTextArea } from './index.tsx'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { setup } from '../../../tests/setup.ts'
import { FormProvider, useForm } from 'react-hook-form'

// @ts-expect-error nor any
const Wrapper = (props) => {
    const formMethods = useForm({
        defaultValues: {
            choices: props.items
        }
    });

    return (
        <FormProvider {...formMethods}>
            {props.children}
        </FormProvider>
    );
};
describe("CustomTextArea", () => {
    it('should render correctly with no items added', () => {
        setup(
            <Wrapper items={[]}>
                <CustomTextArea id='choices' maxChoices={5} maxLength={40} />
            </Wrapper>)
        expect(screen.getByText('(0/5)')).toBeInTheDocument()

    });
    it('should render correctly with 5 items added', () => {
        const items = ['1entry', '2entry', '3entry', '4entry', '5entry']
        setup(
            <Wrapper items={items}>
                <CustomTextArea id='choices' maxChoices={5} maxLength={40} />
            </Wrapper>)
        expect(screen.getByText('(5/5)')).toBeInTheDocument()
        const itemsOnScreen = screen.getAllByText(/entry/i, { ignore: 'textarea' })
        expect(itemsOnScreen).toHaveLength(5)
    });
    it('should render limit reached error message', async () => {

        const items = ['1entry', '2entry', '3entry', '4entry', '5entry']
        const { user } = setup(
            <Wrapper items={items}>
                <CustomTextArea maxLength={40} id='choices' maxChoices={5} />
            </Wrapper>)
        const input = screen.getByPlaceholderText('Type here')
        await user.type(input, 'new entry\n{enter}')
        await user.type(input, 'new entry\n{enter}')
        expect(screen.queryByTestId('error-message')).toHaveTextContent('Limit Reached')
    });
    it('should handle paste with good data', () => {
        const { user } = setup(<Wrapper items={[]}><CustomTextArea
            id='choices' maxChoices={5} maxLength={40}
        /></Wrapper>)
        expect(screen.getByText('(0/5)')).toBeInTheDocument()
        screen.getByPlaceholderText('Type here').focus()
        user.paste('aa\nbb\ncc\ndd\nee\n')
        expect(screen.queryAllByTestId('textarea-line')).toHaveLength(5)
    });
    it('should handle paste with bad data', async () => {
        const { user } = setup(
            <Wrapper items={[]}>
                <CustomTextArea id='choices' maxChoices={5} maxLength={40} />
            </Wrapper>)
        const input = screen.getByPlaceholderText('Type here')
        expect(screen.getByText('(0/5)')).toBeInTheDocument()
        input.focus()
        await user.paste('aabbccddee')
        await user.click(screen.getByTitle('Press Enter or remove focus to add. Backspace to remove last. Paste multiple lines to bulk add.'))
        expect(screen.getByPlaceholderText('Type here')).toHaveTextContent('')
        expect(screen.queryByTestId('textarea-line')).toHaveTextContent('aabbccddee')
    });
    it('should remove item with backspace', async () => {
        const items = ['1entry', '2entry', '3entry', '4entry', '5entry']
        const { user } = setup(
            <Wrapper items={items}>
                <CustomTextArea id='choices' maxChoices={5} maxLength={40} />
            </Wrapper>)
        expect(screen.getByText('5entry')).toBeInTheDocument()
        const input = screen.getByPlaceholderText('Type here')
        await user.type(input, '{backspace}')
        expect(screen.queryByText('5entry')).not.toBeInTheDocument()
    });
    it('should add item on enter if its not present', async () => {
        const items = ['1entry', '2entry', '3entry', '4entry']
        const { user } = setup(<Wrapper items={items}>
            <CustomTextArea id='choices' maxChoices={5} maxLength={40} />
        </Wrapper>)
        const input = screen.getByPlaceholderText('Type here')
        await user.type(input, '4entry{enter}')
        expect(screen.getByText('Duplicate Entries Not Allowed')).toBeInTheDocument()
        await user.type(input, '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}')
        expect(screen.queryByText('Duplicate Entries Not Allowed')).not.toBeInTheDocument()
        await user.type(input, 'added with enter{enter}')
        expect(input).toHaveValue('')
        expect(screen.getByText('added with enter')).toBeInTheDocument()
    });
    it('should remove item from the button', async () => {
        const items = ['1entry', '2entry', '3entry', '4entry', '5entry']
        const { user } = setup(<Wrapper items={items}>
            <CustomTextArea id='choices' maxChoices={5} maxLength={40} /></Wrapper>)
        expect(screen.queryByText('1entry')).toBeInTheDocument()
        const delButton = screen.getAllByRole('button', { name: '✕' }).at(0)
        await user.click(delButton!)
        expect(screen.queryByText('1entry')).not.toBeInTheDocument()
    });
})

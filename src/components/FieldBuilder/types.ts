export type SelectField = {
    id?: string
    label: string
    required: boolean
    choices: string[]
    displayAlpha: boolean
    default: string
}
export const DEFAULT_VALUES: SelectField = {
    label: '',
    default: '',
    required: false,
    choices: [],
    displayAlpha: false
}
export const MAX_CHOICES = 50
export const MAX_CHOICE_LENGTH = 40

import type { FormSchema } from '../../types/form'

export const employeeOnboardingSchema: FormSchema = {
  id: 'employee',
  title: 'Employee onboarding',
  description: 'Employment type drives which number fields you see (contractor vs full time).',
  fields: [
    { name: 'fullName', type: 'text', label: 'Full name', required: true, placeholder: 'e.g. Maria Silva' },
    {
      name: 'employmentType',
      type: 'select',
      label: 'Employment type',
      required: true,
      defaultValue: 'fulltime',
      options: [
        { value: 'fulltime', label: 'Full time' },
        { value: 'contractor', label: 'Contractor' },
        { value: 'parttime', label: 'Part time' },
      ],
    },
    {
      name: 'hourlyRate',
      type: 'number',
      label: 'Hourly rate (USD)',
      required: true,
      placeholder: 'e.g. 75',
      showWhen: { field: 'employmentType', equals: 'contractor' },
      validation: [{ type: 'min', value: 1, message: 'Please enter a positive number' }],
    },
    {
      name: 'salary',
      type: 'number',
      label: 'Annual salary (USD)',
      required: true,
      placeholder: 'e.g. 120000',
      showWhen: { field: 'employmentType', in: ['fulltime', 'parttime'] },
      validation: [{ type: 'min', value: 1, message: 'Must be a positive value' }],
    },
  ],
  submitLabel: 'Save',
}

export const billingAddressSchema: FormSchema = {
  id: 'billing',
  title: 'Billing',
  description: 'Country choosen changes local id fields (example for US vs Brazil).',
  fields: [
    { name: 'street', type: 'text', label: 'Street', required: true, placeholder: 'Rua, número' },
    { name: 'city', type: 'text', label: 'City', required: true },
    {
      name: 'country',
      type: 'select',
      label: 'Country',
      required: true,
      defaultValue: 'br',
      options: [
        { value: 'br', label: 'Brazil' },
        { value: 'us', label: 'United States' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      name: 'cpf',
      type: 'text',
      label: 'CPF',
      required: true,
      showWhen: { field: 'country', equals: 'br' },
      placeholder: '000.000.000-00',
      validation: [
        {
          type: 'pattern',
          value: '^[\\d]{3}\\.?[\\d]{3}\\.?\\d{3}-?\\d{2}$|^[\\d]{11}$',
          message: 'Cpf format looks not right',
        },
      ],
    },
    {
      name: 'ssn',
      type: 'text',
      label: 'SSN / Tax ID',
      required: true,
      showWhen: { field: 'country', equals: 'us' },
      placeholder: 'XXX-XX-XXXX or ITIN',
      validation: [
        { type: 'minLength', value: 4, message: 'Too short' },
        { type: 'maxLength', value: 32, message: 'Too long' },
      ],
    },
  ],
  submitLabel: 'Continue',
}

export const accountSignupSchema: FormSchema = {
  id: 'account',
  title: 'Account',
  description: 'Basic signup: email, password, terms, optional blurb in textarea.',
  fields: [
    { name: 'displayName', type: 'text', label: 'Display name', required: true, placeholder: 'What we show in the app' },
    { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'you@example.com' },
    {
      name: 'password',
      type: 'text',
      label: 'Password',
      required: true,
      placeholder: 'Min 8 caracters',
      validation: [
        { type: 'minLength', value: 8, message: 'At least 8 caracters' },
        { type: 'maxLength', value: 128, message: 'Max 128' },
      ],
    },
    {
      name: 'acceptTerms',
      type: 'checkbox',
      label: 'I accept the terms and privacy policy (fake, just a demo).',
      required: true,
      defaultValue: false,
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'A little about you (optional)',
      required: false,
      placeholder: 'Hobbies, stack, what you are looking for in a form engine demo...',
    },
  ],
  submitLabel: 'Create',
}

export const allFormSchemas: FormSchema[] = [
  employeeOnboardingSchema,
  billingAddressSchema,
  accountSignupSchema,
]

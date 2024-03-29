import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default antfu(
  {
    ignores: ['n/prefer-global/process'],
  },

  ...compat.config({
    extends: [
      'eslint:recommended',
    ],
  }),

)

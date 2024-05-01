module.exports = {
    extends: ['semistandard', 'standard'],
    rules: {
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      'new-cap': 'off'
    }
  }
  
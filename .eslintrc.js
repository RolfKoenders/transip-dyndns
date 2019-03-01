
module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2017
    },
    env: {
        es6: true,
        node: true,
        mocha: true
    },
    extends: 'eslint:recommended',
    globals: {
        expect: true
    },
    overrides: [
        {
            files: [ '**/*Spec.js' ],
            rules: {
                'mocha/no-exclusive-tests': [
                    'error'
                ]
            }
        }
    ],
    rules: {
        indent: [
            'error',
            4
        ],
        'no-whitespace-before-property': [
            'error'
        ],
        'linebreak-style': [
            'warn',
            'unix'
        ],
        quotes: [
            'error',
            'single',
            {
                allowTemplateLiterals: true
            }
        ],
        semi: [
            'error',
            'always'
        ],
        eqeqeq: [
            'error',
            'smart'
        ],
        'keyword-spacing': [
            'error',
            {
                before: true,
                after: true
            }
        ],
        'space-before-function-paren': [
            'error',
            'never'
        ],
        'space-before-blocks': [
            'error'
        ],
        'array-bracket-spacing': [
            'error',
            'always'
        ],
        'comma-spacing': [
            'error',
            {
                before: false,
                after: true
            }
        ],
        'object-curly-spacing': [
            'error',
            'always',
            {
                objectsInObjects: true
            }
        ],
        'key-spacing': [
            'error',
            {
                beforeColon: false,
                afterColon: true
            }
        ],
        'max-depth': [
            'warn',
            4
        ],
        'no-nested-ternary': [
            'error'
        ],
        'no-trailing-spaces': [
            'error'
        ],
        'quote-props': [
            'error',
            'as-needed'
        ],
        'valid-jsdoc': [
            'warn'
        ],
        'prefer-const': [
            'error'
        ],
        'space-infix-ops': [
            'error'
        ]
    }
};

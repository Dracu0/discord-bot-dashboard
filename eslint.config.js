import reactPlugin from "eslint-plugin-react";

export default [
    {
        ignores: [
            'build/**',
            'node_modules/**',
            'server/node_modules/**',
            'test-results/**'
        ]
    },
    {
        files: ['**/*.{js,jsx,cjs,mjs}'],
        plugins: {
            react: reactPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                WebSocket: 'readonly',
                crypto: 'readonly',
                Buffer: 'readonly',
                URLSearchParams: 'readonly',
                Blob: 'readonly',
                ResizeObserver: 'readonly',
                getComputedStyle: 'readonly',
                console: 'readonly',
                URL: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                AbortController: 'readonly',
                DOMException: 'readonly',
                process: 'readonly',
                module: 'readonly',
                require: 'readonly',
                __dirname: 'readonly'
            }
        },
        rules: {
            'no-undef': 'error',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_|React$' }],
            'react/jsx-uses-vars': 'error',
            'react/jsx-uses-react': 'off',
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-console': 'off'
        }
    },
    {
        files: ['server/**/*.js'],
        languageOptions: {
            sourceType: 'script'
        }
    }
];

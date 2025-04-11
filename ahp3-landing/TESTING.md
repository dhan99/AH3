# Testing Guide for AHP3-Landing

## Overview

This project is configured to prevent tests from running automatically on every change. Instead, tests are run only when explicitly requested using the provided tools.

## Testing Tools

### 1. Run Specific Tests

Use the `run-tests.sh` script to selectively run tests:

```bash
# Make the script executable (one-time setup)
chmod +x run-tests.sh

# Show usage information
./run-tests.sh

# Run tests for a specific component
./run-tests.sh Footer

# Run tests in a specific directory
./run-tests.sh landing

# Run all tests
./run-tests.sh all
```

### 2. NPM Scripts

The following npm scripts are available for testing:

```bash
# Run all tests (but only those not ignored in jest.config.js)
npm test

# Run tests in watch mode (automatically re-runs when files change)
npm run test:watch

# Run tests matching a specific pattern (with --passWithNoTests to not fail on missing tests)
npm run test:specific Footer -- --passWithNoTests

# Run all tests, regardless of ignore patterns
npm run test:all
```

## Configuration

The Jest configuration in `jest.config.js` has been set up to ignore all tests by default. This prevents tests from running automatically on changes, improving development speed.

When you explicitly run tests using the commands above, the test pattern overrides these ignore patterns.

## Best Practices

1. **Write tests** for all new components and features
2. **Run relevant tests** after making changes to ensure your code still works as expected
3. **Run all tests** before committing or pushing changes to ensure overall project stability

## CI/CD

If you have CI/CD pipelines set up, they will likely run all tests regardless of this local configuration. This ensures that all tests still pass before merging code into main branches.

#!/bin/bash

# Script to selectively run tests in the project
# Usage: ./run-tests.sh [component|directory|test file]

# If no arguments are provided, print usage
if [ $# -eq 0 ]; then
  echo "Usage: ./run-tests.sh [component|directory|test file]"
  echo ""
  echo "Examples:"
  echo "  Run all tests:           ./run-tests.sh all"
  echo "  Run a specific test:     ./run-tests.sh Footer"
  echo "  Run tests in directory:  ./run-tests.sh landing"
  echo ""
  exit 0
fi

# If "all" is passed, run all tests
if [ "$1" = "all" ]; then
  echo "Running all tests..."
  cd "$(dirname "$0")" && npm test
  exit 0
fi

# Otherwise, run specific tests
echo "Running tests for: $1"
cd "$(dirname "$0")" && npm run test:specific "$1" -- --passWithNoTests

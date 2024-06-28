#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Path to the migration script
MIGRATION_SCRIPT="./src/database/generate-migration.ts"

# Check if migration name is provided
if [ -z "$1" ]; then
  echo "Please provide a migration name."
  exit 1
fi

MIGRATION_NAME=$1

# Run the migration script with the provided migration name
ts-node $MIGRATION_SCRIPT $MIGRATION_NAME

if [ $? -ne 0 ]; then
  echo "Error generating migration."
  exit 1
fi

echo "Migration generated successfully."

#!/bin/bash

# If we don't want too setup the database, detect it from ENV
setup_db=${SETUP_DB}
db_setup_time=${DB_SETUP_TIME:-30}

setupDatabase() {
    echo "Setting up database for tests..."

    # Start the test database
    docker-compose up -d test-db

    echo "Waiting for database ${db_setup_time} seconds before continuing to tests..."

    # Wait for the datbase to finish loading (30 seconds)
    sleep $db_setup_time

    echo "Database setup finished!"
}

closeDatabase() {
    echo "Closing database for tests..."

    # Shutdown the test database
    docker-compose down
}

if [ ${setup_db} ]; then
    echo "SETUP_DB was set, preparing database..."
    setupDatabase
fi

# Set the node environment to test
export NODE_ENV=test

# Run mocha using the provided mocharc file
./node_modules/.bin/mocha

if [ ${setup_db} ]; then closeDatabase; fi

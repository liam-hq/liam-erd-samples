#!/bin/bash
set -e

# Ensure PostgreSQL is running
echo "Checking PostgreSQL status..."
pg_isready -h localhost -p 5432 -U postgres || {
    echo "PostgreSQL is not running. Starting PostgreSQL..."
    # Add commands to start PostgreSQL if needed
}

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
psql -h localhost -p 5432 -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'django_sample'" | grep -q 1 || {
    echo "Creating database django_sample..."
    psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE django_sample"
}

# Apply Django migrations
echo "Applying Django migrations..."
cd django_sample
python manage.py migrate

# Extract schema using pg_dump
echo "Extracting schema using pg_dump..."
pg_dump -h localhost -p 5432 -U postgres -d django_sample --schema-only > ../schema.sql

echo "Schema extraction completed successfully."

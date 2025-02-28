# Django with PostgreSQL

This sample demonstrates how to use Liam ERD with Django ORM through PostgreSQL.

## Overview

Django ORM defines database schemas through model classes in Python. These models are then translated into database tables through migrations. This sample shows how to extract schema information from a Django ORM-based database using pg_dump and then use Liam ERD to generate ER diagrams.

## How it works

1. Django models are defined in Python
2. Django migrations create the database schema in PostgreSQL
3. pg_dump extracts the schema in SQL format
4. Liam ERD's PostgreSQL parser processes the schema

## Requirements

- PostgreSQL
- Django
- psycopg2-binary
- tbls

## Usage

1. Install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install django psycopg2-binary
   ```

2. Configure PostgreSQL connection in `.tbls.yml`

3. Run the extraction script:
   ```bash
   ./extract_schema.sh
   ```

4. Generate documentation:
   ```bash
   tbls doc --force --config .tbls.yml
   ```

5. Generate ER diagrams:
   ```bash
   npx @liam-hq/cli erd build --format postgres --input schema.sql
   ```

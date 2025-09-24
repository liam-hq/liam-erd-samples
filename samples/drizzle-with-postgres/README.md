# Drizzle ORM PostgreSQL Sample

This project is a development example using Drizzle ORM with PostgreSQL, demonstrating how to define comprehensive database schemas that can be visualized as ER diagrams using Liam.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database (using Docker):
```bash
docker run --name postgres-drizzle -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=drizzle_sample -d postgres:16
```

3. Configure environment variables (optional):
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_NAME=drizzle_sample
```

4. Generate SQL migrations:
```bash
npm run db:generate
```

5. Push schema to database:
```bash
npm run db:push
```

6. Open Drizzle Studio to view the database:
```bash
npm run db:studio
```

## Schema Features

- User management with profiles
- Product catalog with categories
- Order management system
- Shopping cart functionality
- Blog posts with comments and tags
- Notification system
- Proper foreign key relationships
- Enum types for order and notification status

## Workflow

The documentation process is automated using a GitHub Actions workflow defined in [.github/workflows/drizzle-with-postgres.yml](/.github/workflows/drizzle-with-postgres.yml).

## Documentation

For more detailed information, please refer to the [Liam documentation's Drizzle ORM support page](https://liambx.com/docs/parser/supported-formats/drizzle).

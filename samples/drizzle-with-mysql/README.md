# Drizzle ORM MySQL Sample

This sample demonstrates a comprehensive e-commerce database schema using Drizzle ORM with MySQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up MySQL database (using Docker):
```bash
docker run --name mysql-drizzle -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mysql -e MYSQL_DATABASE=drizzle_sample -d mysql:8
```

3. Configure environment variables (optional):
```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=mysql
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
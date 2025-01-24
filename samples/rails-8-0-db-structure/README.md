# Rails 8.0 with `db/structure.sql`

This project is a development example using Rails 8.0, utilizing `db/structure.sql` instead of `db/schema.rb`.

In this demo, a GitHub Actions workflow generates `db/schema.rb`, which is then used as input for the Liam CLI.

## Workflow

The deployment process is automated using a GitHub Actions workflow defined in [.github/workflows/rails-8-0-db-structure.yml](/.github/workflows/rails-8-0-db-structure.yml).

## Documentation

For more detailed information, please refer to the [Liam documentation's Rails support page](https://liambx.com/docs/parser/supported-formats/rails).

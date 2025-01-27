# Generating Foreign Keys for Rails ER Diagrams

This project is a development example using Rails.

In this demo, a GitHub Actions workflow appends `add_foreign_key` statements to `db/schema.rb` based on associations defined in Active Record models.

This allows relationships to be rendered in the ER diagram even in projects where no foreign keys are explicitly set in the database.

## Workflow

The deployment process is automated using a GitHub Actions workflow defined in [.github/workflows/rails-add-association-foreign-key.yml](/.github/workflows/rails-add-association-foreign-key.yml).

The workflow executes a Rake task. In particular, please take note of the following file:

- `lib/tasks/append_foreign_key_to_db_schema_rb.rake`

## Documentation

For more detailed information, please refer to the [Liam documentation's Rails support page](https://liambx.com/docs/parser/supported-formats/rails).

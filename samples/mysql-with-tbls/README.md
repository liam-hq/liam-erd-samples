# MySQL with tbls

This project is a development example using MySQL and tbls, demonstrating how to automatically generate database documentation.

In this demo, a GitHub Actions workflow generates database documentation using tbls, which is then used as input for the Liam CLI to create ER diagrams.

## Workflow

The documentation process is automated using a GitHub Actions workflow defined in [.github/workflows/mysql-with-tbls.yml](/.github/workflows/mysql-with-tbls.yml).

## Documentation

For more detailed information, please refer to:

- [tbls documentation](https://github.com/k1LoW/tbls)
- [Liam documentation's tbls support page](https://liambx.com/docs/parser/supported-formats/tbls)

# categories

## Description

## Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
| ---- | ---- | ------- | -------- | -------- | ------- | ------- |
| id | int |  | false | [products](products.md) |  |  |
| name | varchar(255) |  | false |  |  |  |

## Constraints

| Name | Type | Definition |
| ---- | ---- | ---------- |
| PK__categori_* | PRIMARY KEY | CLUSTERED, unique, part of a PRIMARY KEY constraint, [ id ] |
| UQ__categori_* | UNIQUE | NONCLUSTERED, unique, part of a UNIQUE constraint, [ name ] |

## Indexes

| Name | Definition |
| ---- | ---------- |
| PK__categori_* | CLUSTERED, unique, part of a PRIMARY KEY constraint, [ id ] |
| UQ__categori_* | NONCLUSTERED, unique, part of a UNIQUE constraint, [ name ] |

## Relations

![er](categories.svg)

---

> Generated by [tbls](https://github.com/k1LoW/tbls)

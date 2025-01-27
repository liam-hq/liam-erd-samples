# This Rake task automatically appends `add_foreign_key` statements to `db/schema.rb`
# based on `belongs_to` associations defined in Active Record models.
#
# Purpose:
# - Some Rails projects define `belongs_to` associations in model files without actual foreign key constraints in the database.
# - Tools like Liam ERD rely on `db/schema.rb` rather than loading model files, which can result in missing relationships in ER diagrams.
# - This task generates foreign key constraints dynamically and appends them to `db/schema.rb` to make these associations visible in ER diagrams.
#

desc 'appends `add_foreign_key` statements to `db/schema.rb`'
task append_foreign_key_to_db_schema_rb: :environment do
  next unless Rails.env.local?

  # Prerequisite: The database must be accessible.
  Rails.application.eager_load!
  # Filter out models that have valid table_name
  models_with_table = ActiveRecord::Base.descendants.select do |model|
    model.table_exists? && model.table_name.present?
  end
  # Map belongs_to associations to the corresponding referenced tables
  assoc_map = models_with_table.map do |model|
    target_tables = model.reflect_on_all_associations(:belongs_to).map do |assoc|
      {
        table_name: assoc.class_name.safe_constantize&.table_name,
        column_name: "#{assoc.name}_id",
      }
    end.compact
    [model.table_name, target_tables]
  end.to_h
  # Generate add_foreign_key statements from the mapped relationships
  # This is a simple example, so in practice you’d need to handle duplicates carefully
  content = assoc_map.flat_map do |from_table, to_tables|
    to_tables.map { |to_table| %(add_foreign_key "#{from_table}", "#{to_table[:table_name]}", column: "#{to_table[:column_name]}") }
  end.join("\n")

  # Write or append this content to db/schema.rb in some way
  File.open("db/schema.rb", "a") do |file|
    file.puts(content) if content.present?
  end
end

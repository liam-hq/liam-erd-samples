class CreateInitials < ActiveRecord::Migration[8.0]
  def up
    execute <<-SQL
      CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
    SQL

    create_table :users do |t|
      t.string :email, null: false
      t.string :username, null: false
      t.string :password, null: false
      t.timestamps
      t.index :email, unique: true
    end

    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.text :bio
      t.string :avatar
      t.date :birth_date
      t.string :phone_number
      t.timestamps
      # t.index :user_id, unique: true
    end

    create_table :posts do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.boolean :published, default: false
      t.references :author, null: false, foreign_key: { to_table: :users }
      t.timestamps
    end

    create_table :comments do |t|
      t.text :content, null: false
      t.references :post, null: false, foreign_key: true
      t.references :author, null: false, foreign_key: { to_table: :users }
      t.timestamps
    end

    create_table :tags do |t|
      t.string :name, null: false
      t.timestamps
      t.index :name, unique: true
    end

    create_table :post_tags, id: false do |t|
      t.references :post, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true
      t.index [:post_id, :tag_id], unique: true
    end

    create_table :categories do |t|
      t.string :name, null: false
      t.timestamps
      t.index :name, unique: true
    end

    create_table :products do |t|
      t.string :name, null: false
      t.text :description, null: false
      t.decimal :price, null: false, precision: 10, scale: 2
      t.integer :stock, null: false
      t.references :category, null: false, foreign_key: true
      t.timestamps
    end

    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.column :status, :order_status, null: false, default: 'PENDING'
      t.decimal :total_price, null: false, precision: 10, scale: 2
      t.timestamps
    end

    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.integer :quantity, null: false
      t.decimal :price, null: false, precision: 10, scale: 2
      t.timestamps
    end

    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :content, null: false
      t.boolean :read, default: false
      t.timestamps
    end
  end

  def down
    drop_table :notifications
    drop_table :order_items
    drop_table :orders
    drop_table :products
    drop_table :categories
    drop_table :post_tags
    drop_table :tags
    drop_table :comments
    drop_table :posts
    drop_table :profiles
    drop_table :users

    execute <<-SQL
      DROP TYPE order_status;
    SQL
  end
end

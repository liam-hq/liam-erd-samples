-- Create database
CREATE DATABASE blog_app;
GO
USE blog_app;
GO

-- Users table
CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE()
);
GO

-- Profiles table
CREATE TABLE profiles (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar VARCHAR(255),
  birth_date DATE,
  phone_number VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users (id)
);
GO

-- Posts table
CREATE TABLE posts (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  published BIT DEFAULT 0,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  author_id INT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users (id)
);
GO

-- Comments table
CREATE TABLE comments (
  id INT IDENTITY(1,1) PRIMARY KEY,
  content TEXT NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  post_id INT NOT NULL,
  author_id INT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts (id),
  FOREIGN KEY (author_id) REFERENCES users (id)
);
GO

-- Tags table
CREATE TABLE tags (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);
GO

-- Posts_Tags junction table
CREATE TABLE posts_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts (id),
  FOREIGN KEY (tag_id) REFERENCES tags (id)
);
GO

-- Categories table
CREATE TABLE categories (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);
GO

-- Products table
CREATE TABLE products (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  category_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);
GO

-- Orders table
CREATE TABLE orders (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  total_price DECIMAL(10, 2) NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT CHK_OrderStatus CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'))
);
GO

-- Order_Items table
CREATE TABLE order_items (
  id INT IDENTITY(1,1) PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);
GO

-- Notifications table
CREATE TABLE notifications (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_read BIT DEFAULT 0,
  created_at DATETIME2 DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users (id)
);
GO

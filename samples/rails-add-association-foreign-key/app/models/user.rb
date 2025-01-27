class User < ApplicationRecord
  has_one :profile
  has_many :posts, foreign_key: :author_id, class_name: 'Post'
  has_many :comments, foreign_key: :author_id, class_name: 'Comment'
end

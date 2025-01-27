class Post < ApplicationRecord
  belongs_to :author, class_name: 'User'
  has_many :post_tags
end

import {
  mysqlTable,
  mysqlEnum,
  serial,
  text,
  varchar,
  int,
  boolean,
  timestamp,
  decimal,
  json,
  index,
  uniqueIndex,
  primaryKey,
  unique,
  check,
} from 'drizzle-orm/mysql-core'
import { relations, sql } from 'drizzle-orm'

// ========================================
// ENUMs
// ========================================

export const userRoleEnum = mysqlEnum('user_role', ['admin', 'moderator', 'user', 'guest'])
export const orderStatusEnum = mysqlEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
export const paymentMethodEnum = mysqlEnum('payment_method', ['credit_card', 'paypal', 'bank_transfer', 'crypto'])

// ========================================
// Core Tables with Various Patterns
// ========================================

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  uuid: varchar('uuid', { length: 36 }).notNull().unique().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: userRoleEnum.default('user').notNull(),
  age: int('age'),
  isActive: boolean('is_active').default(true).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
  bio: text('bio'),
  profilePictureUrl: text('profile_picture_url'),
  preferences: json('preferences'),
  tags: json('tags').$type<string[]>(),
  metadata: json('metadata'),
}, (table) => ({
  // Composite index
  fullNameIdx: index('users_full_name_idx').on(table.firstName, table.lastName),
  // Partial index (implemented as regular index in MySQL)
  activeUsersEmailIdx: index('users_active_email_idx').on(table.email),
  // JSON field index (not supported directly in MySQL, requires virtual columns)
  // Unique index
  verifiedEmailIdx: uniqueIndex('users_verified_email_unique_idx').on(table.email),
  // CHECK constraints
  ageCheck: check('users_age_check', sql`age >= 0 AND age <= 150`),
  usernameCheck: check('users_username_check', sql`CHAR_LENGTH(username) >= 3`),
}))

export const categories = mysqlTable('categories', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  parentId: int('parent_id'),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: int('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
}, (table) => ({
  // Index for hierarchical queries
  parentIdIdx: index('categories_parent_id_idx').on(table.parentId),
  // Composite unique constraint
  parentSlugUnique: unique('categories_parent_slug_unique').on(table.parentId, table.slug),
  // Index for active categories
  activeCategoriesIdx: index('categories_active_idx').on(table.name, table.isActive),
  // CHECK constraint
  sortOrderCheck: check('categories_sort_order_check', sql`sort_order >= 0`),
}))

export const products = mysqlTable('products', {
  id: int('id').autoincrement().primaryKey(),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  weight: decimal('weight', { precision: 8, scale: 3 }),
  dimensions: json('dimensions'),
  categoryId: int('category_id').notNull().references(() => categories.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade'
  }),
  brandId: int('brand_id').references(() => brands.id, {
    onDelete: 'set null',
    onUpdate: 'cascade'
  }),
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  stockQuantity: int('stock_quantity').default(0).notNull(),
  lowStockThreshold: int('low_stock_threshold').default(10).notNull(),
  tags: json('tags').$type<string[]>(),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
}, (table) => ({
  // Composite index for category and active status
  categoryActiveIdx: index('products_category_active_idx')
    .on(table.categoryId, table.isActive),
  // Featured products index
  featuredIdx: index('products_featured_idx')
    .on(table.isFeatured, table.isActive),
  // Price range index
  priceIdx: index('products_price_idx').on(table.price),
  // Low stock index
  lowStockIdx: index('products_low_stock_idx')
    .on(table.stockQuantity),
  // Brand index
  brandIdx: index('products_brand_idx').on(table.brandId),
  // Unique SKU per brand
  brandSkuUnique: unique('products_brand_sku_unique').on(table.brandId, table.sku),
  // CHECK constraints
  pricePositiveCheck: check('products_price_positive', sql`price > 0`),
  stockNonNegativeCheck: check('products_stock_non_negative', sql`stock_quantity >= 0`),
  thresholdPositiveCheck: check('products_threshold_positive', sql`low_stock_threshold > 0`),
  compareAtPriceCheck: check('products_compare_at_price_check', 
    sql`compare_at_price IS NULL OR compare_at_price >= price`),
}))

export const brands = mysqlTable('brands', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  logoUrl: text('logo_url'),
  websiteUrl: text('website_url'),
  isActive: boolean('is_active').default(true).notNull(),
  foundedYear: int('founded_year'),
  countryCode: varchar('country_code', { length: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
}, (table) => ({
  // Active brands index
  activeIdx: index('brands_active_idx')
    .on(table.name, table.isActive),
  // Country index
  countryIdx: index('brands_country_idx').on(table.countryCode),
  // CHECK constraints
  foundedYearCheck: check('brands_founded_year_check',
    sql`founded_year >= 1800 AND founded_year <= 2025`),
  countryCodeCheck: check('brands_country_code_check', 
    sql`country_code REGEXP '^[A-Z]{2}$'`),
}))

export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: int('user_id').notNull().references(() => users.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade'
  }),
  status: orderStatusEnum.default('pending').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  shippingAmount: decimal('shipping_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  paymentMethod: paymentMethodEnum,
  paymentStatus: varchar('payment_status', { length: 20 }).default('pending').notNull(),
  shippingAddress: json('shipping_address'),
  billingAddress: json('billing_address'),
  notes: text('notes'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  cancelledAt: timestamp('cancelled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
}, (table) => ({
  // User orders index
  userIdIdx: index('orders_user_id_idx').on(table.userId),
  // Status index
  statusIdx: index('orders_status_idx').on(table.status),
  // Date range queries
  createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
  // Payment status index
  paymentStatusIdx: index('orders_payment_status_idx').on(table.paymentStatus),
  // Composite index for user and status
  userStatusIdx: index('orders_user_status_idx').on(table.userId, table.status),
  // Active orders
  activeOrdersIdx: index('orders_active_idx')
    .on(table.status, table.createdAt),
  // CHECK constraints
  subtotalPositiveCheck: check('orders_subtotal_positive', sql`subtotal >= 0`),
  totalPositiveCheck: check('orders_total_positive', sql`total_amount >= 0`),
  taxNonNegativeCheck: check('orders_tax_non_negative', sql`tax_amount >= 0`),
  shippingNonNegativeCheck: check('orders_shipping_non_negative', sql`shipping_amount >= 0`),
  discountNonNegativeCheck: check('orders_discount_non_negative', sql`discount_amount >= 0`),
  currencyFormatCheck: check('orders_currency_format', sql`currency REGEXP '^[A-Z]{3}$'`),
  statusDateCheck: check('orders_status_date_check', 
    sql`(shipped_at IS NULL OR shipped_at >= created_at) AND 
        (delivered_at IS NULL OR delivered_at >= COALESCE(shipped_at, created_at)) AND
        (cancelled_at IS NULL OR cancelled_at >= created_at)`),
}))

export const orderItems = mysqlTable('order_items', {
  id: int('id').autoincrement().primaryKey(),
  orderId: int('order_id').notNull().references(() => orders.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  productId: int('product_id').notNull().references(() => products.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade'
  }),
  quantity: int('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  productSnapshot: json('product_snapshot'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Order items lookup
  orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
  // Product sales analysis
  productIdIdx: index('order_items_product_id_idx').on(table.productId),
  // Composite unique constraint - prevent duplicate products in same order
  orderProductUnique: unique('order_items_order_product_unique').on(table.orderId, table.productId),
  // CHECK constraints
  quantityPositiveCheck: check('order_items_quantity_positive', sql`quantity > 0`),
  unitPricePositiveCheck: check('order_items_unit_price_positive', sql`unit_price > 0`),
  totalPriceCheck: check('order_items_total_price_check', 
    sql`total_price = unit_price * quantity`),
}))

export const reviews = mysqlTable('reviews', {
  id: int('id').autoincrement().primaryKey(),
  productId: int('product_id').notNull().references(() => products.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  userId: int('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  orderId: int('order_id').references(() => orders.id, {
    onDelete: 'set null',
    onUpdate: 'cascade'
  }),
  rating: int('rating').notNull(),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  isVerifiedPurchase: boolean('is_verified_purchase').default(false).notNull(),
  isApproved: boolean('is_approved').default(true).notNull(),
  helpfulVotes: int('helpful_votes').default(0).notNull(),
  totalVotes: int('total_votes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
}, (table) => ({
  // Product reviews lookup
  productIdIdx: index('reviews_product_id_idx').on(table.productId),
  // User reviews lookup
  userIdIdx: index('reviews_user_id_idx').on(table.userId),
  // Rating analysis
  ratingIdx: index('reviews_rating_idx').on(table.rating),
  // Approved reviews
  approvedIdx: index('reviews_approved_idx')
    .on(table.productId, table.rating, table.isApproved),
  // Verified purchase reviews
  verifiedIdx: index('reviews_verified_idx')
    .on(table.productId, table.isVerifiedPurchase),
  // One review per user per product
  userProductUnique: unique('reviews_user_product_unique').on(table.userId, table.productId),
  // CHECK constraints
  ratingRangeCheck: check('reviews_rating_range', sql`rating >= 1 AND rating <= 5`),
  votesCheck: check('reviews_votes_check', 
    sql`helpful_votes >= 0 AND total_votes >= helpful_votes`),
}))

// ========================================
// Many-to-Many Junction Tables
// ========================================

export const productTags = mysqlTable('product_tags', {
  productId: int('product_id').notNull().references(() => products.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  tagId: int('tag_id').notNull().references(() => tags.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Composite primary key
  pk: primaryKey({ columns: [table.productId, table.tagId] }),
  // Index for tag-based queries
  tagIdIdx: index('product_tags_tag_id_idx').on(table.tagId),
}))

export const tags = mysqlTable('tags', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  description: text('description'),
  color: varchar('color', { length: 7 }),
  isActive: boolean('is_active').default(true).notNull(),
  usageCount: int('usage_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Active tags index
  activeIdx: index('tags_active_idx')
    .on(table.name, table.isActive),
  // Usage count for popular tags
  usageCountIdx: index('tags_usage_count_idx').on(table.usageCount),
  // CHECK constraints
  colorFormatCheck: check('tags_color_format', sql`color REGEXP '^#[0-9A-Fa-f]{6}$'`),
  usageCountNonNegativeCheck: check('tags_usage_count_non_negative', sql`usage_count >= 0`),
}))

// ========================================
// Relations
// ========================================

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'CategoryHierarchy',
  }),
  children: many(categories, {
    relationName: 'CategoryHierarchy',
  }),
  products: many(products),
}))

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  orderItems: many(orderItems),
  reviews: many(reviews),
  productTags: many(productTags),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
  reviews: many(reviews),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  productTags: many(productTags),
}))

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}))
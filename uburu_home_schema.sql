-- =======================================================
-- UBURU HOME - cPanel MySQL / MariaDB Schema & Seed Script
-- Import via cPanel -> phpMyAdmin -> Import tab
-- =======================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table: home_categories
CREATE TABLE IF NOT EXISTS `home_categories` (
    `id` VARCHAR(64) NOT NULL,
    `slug` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `short_name` VARCHAR(64) NOT NULL,
    `tagline` VARCHAR(255) DEFAULT '',
    `description` TEXT,
    `type` ENUM('product', 'service') NOT NULL DEFAULT 'product',
    `icon_name` VARCHAR(64) DEFAULT 'ShoppingCart',
    `accent_color` VARCHAR(64) DEFAULT 'from-amber-500 to-yellow-400',
    `highlight_image` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`slug`),
    UNIQUE KEY `idx_category_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: home_items
CREATE TABLE IF NOT EXISTS `home_items` (
    `id` VARCHAR(64) NOT NULL,
    `category_slug` VARCHAR(64) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `original_price` DECIMAL(10, 2) DEFAULT NULL,
    `discount_percent` INT DEFAULT NULL,
    `currency` VARCHAR(10) DEFAULT 'KES',
    `brand` VARCHAR(128) DEFAULT 'Uburu Brand',
    `tag` VARCHAR(64) DEFAULT 'Store',
    `image` TEXT NOT NULL,
    `type` ENUM('product', 'service') DEFAULT 'product',
    `in_stock` TINYINT(1) DEFAULT 1,
    `stock_location` VARCHAR(64) DEFAULT 'NBO | KBU',
    `description` TEXT,
    `features` TEXT DEFAULT NULL,
    `rating` DECIMAL(2, 1) DEFAULT 5.0,
    `review_count` INT DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_item_category` (`category_slug`),
    CONSTRAINT `fk_home_items_category` FOREIGN KEY (`category_slug`) REFERENCES `home_categories` (`slug`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- 3. Initial Seed: Default Uburu Home Departments
INSERT INTO `home_categories` (`id`, `slug`, `name`, `short_name`, `tagline`, `description`, `type`, `icon_name`, `accent_color`, `highlight_image`)
VALUES
('uburu-smart-shopper', 'uburu-smart-shopper', 'Uburu Smart Shopper', 'Supermarket', 'Your online supermarket for groceries, household goods, and daily provisions.', 'A one-stop supermarket experience featuring daily groceries, household provisions, packaged foods, personal care essentials, and family shopping value packs.', 'product', 'ShoppingCart', 'from-amber-500 to-yellow-400', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'),
('uburu-veggies', 'uburu-veggies', 'Uburu Veggies', 'Veggies', 'Farm fresh organic vegetables straight to your doorstep.', 'Nutritious, organically grown local vegetables harvested fresh and delivered daily.', 'product', 'Carrot', 'from-emerald-600 to-green-400', 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80'),
('uburu-food', 'uburu-food', 'Uburu Food', 'Hot Meals', 'Freshly prepared food from hotels and restaurants like fast food.', 'Delicious freshly prepared dishes from top hotels, restaurants, and fast food spots.', 'product', 'UtensilsCrossed', 'from-amber-600 to-orange-400', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'),
('uburu-office', 'uburu-office', 'Uburu Office', 'Office & Desk', 'Productivity essentials, stationery, and workspace supplies.', 'Quality stationery, notebooks, desk organizers, and office consumables for modern professionals.', 'product', 'Briefcase', 'from-blue-600 to-cyan-400', 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80'),
('uburu-beauty', 'uburu-beauty', 'Uburu Beauty', 'Beauty & Care', 'Natural skincare, organic soaps, and pure botanical wellness.', 'Handcrafted pure shea butters, botanical body oils, and natural daily self-care formulations.', 'product', 'Sparkles', 'from-rose-500 to-pink-400', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'),
('uburu-kids', 'uburu-kids', 'Uburu Kids', 'Kids & Youth', 'Creative learning materials, games, and children essentials.', 'Educational toys, creative art supplies, storybooks, and comfortable daily items for growing children.', 'product', 'Baby', 'from-amber-400 to-yellow-300', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'),
('uburu-household', 'uburu-household', 'Uburu Household', 'Household', 'Bedding, homeware, cleaning supplies, and home comforts.', 'Durable home utilities, cozy blankets, eco-friendly cleaning detergents, and essential housewares.', 'product', 'Home', 'from-teal-600 to-emerald-400', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'),
('uburu-services', 'uburu-services', 'Uburu Services', 'Services', 'Repairs, home maintenance, deep cleaning, and skilled trades.', 'On-demand vetted home maintenance, deep cleaning, electrical diagnostics, and skilled trade professionals.', 'service', 'Wrench', 'from-amber-500 to-red-500', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'),
('uburu-souvenirs', 'uburu-souvenirs', 'Uburu Souvenirs', 'Souvenirs & Art', 'Authentic handcrafted cultural keepsakes and indigenous art.', 'Unique beaded jewelry, wood carvings, soapstone sculptures, and hand-woven artisanal goods.', 'product', 'Gift', 'from-purple-600 to-pink-500', 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80'),
('uburu-medical', 'uburu-medical', 'Uburu Medical', 'Medical & Health', 'First-aid essentials, wellness kits, and home health care.', 'Comprehensive first-aid boxes, digital thermometers, diagnostic supplies, and basic wellness essentials.', 'product', 'Stethoscope', 'from-red-600 to-rose-400', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'),
('uburu-clothing', 'uburu-clothing', 'Uburu Clothing', 'Clothing', 'Premium everyday style. Quality tees, hoodies, and headwear.', 'Comfortable premium apparel made from breathable heavy-weight cotton designed for everyday wear.', 'product', 'Shirt', 'from-yellow-500 to-amber-300', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'),
('uburu-construction', 'uburu-construction', 'Uburu Construction', 'Construction', 'Hardware, tools, building materials, and repair supplies.', 'High-grade cement, treated timber, heavy-duty hand tools, fasteners, and safety gear.', 'product', 'HardHat', 'from-amber-600 to-stone-500', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80')
ON DUPLICATE KEY UPDATE
`name`=VALUES(`name`), `tagline`=VALUES(`tagline`), `description`=VALUES(`description`), `highlight_image`=VALUES(`highlight_image`);

-- 4. Initial Seed: Sample Souvenir & Apparel Products
INSERT INTO `home_items` (`id`, `category_slug`, `name`, `price`, `original_price`, `discount_percent`, `currency`, `brand`, `tag`, `image`, `type`, `in_stock`, `stock_location`, `description`, `features`)
VALUES
('hoodies', 'uburu-souvenirs', 'Uburu Premium Heavyweight Fleece Hoodie - Cozy Fit', 2800.00, 3500.00, 20, 'KES', 'Uburu Apparel', 'Cozy', '/src/assets/hoodie.webp', 'product', 1, 'NBO | KBU', 'Comfortable heavyweight brushed fleece hoodie built for everyday warmth and durability.', '["Pre-shrunk premium cotton fleece blend", "Front kangaroo pocket with reinforced stitching", "Double-layered drawstring hood", "Available in Unisex S, M, L, XL, XXL"]'),
('tshirts', 'uburu-souvenirs', 'Uburu Classic Organic Cotton Crewneck T-Shirt', 1000.00, 1300.00, 23, 'KES', 'Uburu Apparel', 'Organic', '/src/assets/shirt.webp', 'product', 1, 'NBO | KBU', 'Everyday lightweight breathable cotton tee printed with the original Uburu signature motif.', '["100% ring-spun organic combed cotton", "Soft-touch screen print design", "Ribbed crew neckline", "Machine washable"]'),
('caps', 'uburu-souvenirs', 'Uburu Heritage 6-Panel Embroidered Baseball Cap', 800.00, 1000.00, 20, 'KES', 'Uburu Apparel', 'Classic', '/src/assets/cap.webp', 'product', 1, 'NBO | KBU', 'Structured low-profile dad cap crafted from durable cotton twill with high-density 3D embroidery.', '["Durable 100% cotton twill fabric", "Curved brim with UV sun protection", "Adjustable antique brass buckle strap", "Breathable eyelet vents"]'),
('waterbottles', 'uburu-souvenirs', 'Uburu Insulated Stainless Steel Thermal Flask (750ml)', 1500.00, 2000.00, 25, 'KES', 'Uburu Gear', 'Eco', '/src/assets/waterbottle.webp', 'product', 1, 'NBO | KBU', 'Double-wall vacuum-insulated stainless steel hydration flask engineered to keep beverages ice-cold for 24 hours.', '["Double-wall vacuum insulation", "18/8 food-grade stainless steel", "Leak-proof sport screw cap with carrying loop", "100% BPA and toxin free"]'),
('tshirts-clothing', 'uburu-clothing', 'Uburu Essential Graphic Streetwear Tee', 1200.00, 1500.00, 20, 'KES', 'Uburu Apparel', 'New', '/src/assets/shirt.webp', 'product', 1, 'NBO | KBU', 'Relaxed fit heavy cotton tee with vibrant graphic printing.', '["100% Heavyweight Cotton", "Drop shoulder cut", "Colorfast print"]'),
('hoodies-clothing', 'uburu-clothing', 'Uburu Thermal Zip-Up Hoodie', 3200.00, 3800.00, 15, 'KES', 'Uburu Apparel', 'SALE', '/src/assets/hoodie.webp', 'product', 1, 'NBO | KBU', 'Full-zip front thermal jacket with fleece inner lining.', '["Heavyweight brushed cotton", "YKK metal zipper", "Deep pockets"]')
ON DUPLICATE KEY UPDATE
`name`=VALUES(`name`), `price`=VALUES(`price`), `image`=VALUES(`image`), `description`=VALUES(`description`);

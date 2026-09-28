import type { StorefrontItem } from "./storefrontCatalog";

import ebook1 from "../assets/ebook1.jpg";
import ebook2 from "../assets/ebook2.jpg";
import ebook3 from "../assets/ebook3.jpg";
import ebookCover from "../assets/ebook.webp";
import shirt from "../assets/shirt.webp";
import cap from "../assets/cap.webp";
import hoodie from "../assets/hoodie.webp";
import waterBottle from "../assets/waterbottle.webp";
import pic1 from "../assets/pic1.webp";
import pic3 from "../assets/pic3.webp";
import pic4 from "../assets/pic4.webp";
import pic5 from "../assets/pic5.webp";
import pic7 from "../assets/pic7.webp";
import pic8 from "../assets/pic8.webp";
import pic9 from "../assets/pic9.webp";
import pic11 from "../assets/pic11.webp";
import kidsImage from "../assets/kids.webp";

export const ebookProducts: StorefrontItem[] = [
  {
    id: "ebook-destined-to-reign",
    name: "Destined to Reign",
    price: 1200,
    currency: "KES",
    tag: "Digital",
    image: ebook1,
  },
  {
    id: "ebook-live-the-let-go-life",
    name: "Live the Let Go Life",
    price: 1200,
    currency: "KES",
    tag: "Digital",
    image: ebook2,
  },
  {
    id: "ebook-unmerited-favor",
    name: "Unmerited Favor",
    price: 1200,
    currency: "KES",
    tag: "Digital",
    image: ebook3,
  },
];

export type CategoryType = "product" | "service";

export interface HomeCategoryItem extends StorefrontItem {
  categorySlug: string;
  type?: CategoryType;
  brand?: string;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockLocation?: string;
  hasColorOptions?: boolean;
  imageCount?: number;
  badge?: string;
  features?: string[];
  unit?: string;
  description?: string;
}

export interface HomeCategory {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  type: CategoryType;
  iconName: string;
  accentColor: string;
  highlightImage: string;
  items: HomeCategoryItem[];
}

export const originalSmartShopperItems: HomeCategoryItem[] = [
  {
    id: "hoodies",
    name: "Uburu Premium Heavyweight Fleece Hoodie - Cozy Fit",
    price: 2800,
    originalPrice: 3500,
    discountPercent: 20,
    currency: "KES",
    brand: "Uburu Apparel",
    tag: "Cozy",
    image: hoodie,
    categorySlug: "uburu-smart-shopper",
    rating: 4.8,
    reviewCount: 142,
    inStock: true,
    stockLocation: "NBO | KBU",
    hasColorOptions: true,
    imageCount: 4,
    badge: "SALE",
    description: "Comfortable heavyweight brushed fleece hoodie built for everyday warmth and durability.",
  },
  {
    id: "tshirts",
    name: "Uburu Classic Organic Cotton Crewneck T-Shirt",
    price: 1000,
    originalPrice: 1300,
    discountPercent: 23,
    currency: "KES",
    brand: "Uburu Apparel",
    tag: "Apparel",
    image: shirt,
    categorySlug: "uburu-smart-shopper",
    rating: 4.7,
    reviewCount: 98,
    inStock: true,
    stockLocation: "NBO",
    hasColorOptions: true,
    imageCount: 3,
    description: "100% combed ring-spun cotton unisex tees supporting youth shelter and reintegration.",
  },
  {
    id: "caps",
    name: "Uburu Structured 6-Panel Embroidered Athletic Cap",
    price: 900,
    originalPrice: 1150,
    discountPercent: 21,
    currency: "KES",
    brand: "Uburu Apparel",
    tag: "Everyday",
    image: cap,
    categorySlug: "uburu-smart-shopper",
    rating: 4.6,
    reviewCount: 65,
    inStock: true,
    stockLocation: "NBO | KBU",
    hasColorOptions: true,
    imageCount: 2,
    description: "Classic structured 6-panel cap with high quality embroidery and adjustable brass buckle.",
  },
  {
    id: "reusable-bottles",
    name: "Uburu Eco-Insulated Stainless Steel Water Bottle (750ml)",
    price: 1500,
    originalPrice: 1850,
    discountPercent: 19,
    currency: "KES",
    brand: "Uburu Living",
    tag: "Eco",
    image: waterBottle,
    categorySlug: "uburu-smart-shopper",
    rating: 4.9,
    reviewCount: 184,
    inStock: true,
    stockLocation: "NBO",
    hasColorOptions: true,
    imageCount: 3,
    badge: "TOP RATED",
    description: "Double-wall vacuum insulated bottle keeping beverages cold for 24h or steaming hot for 12h.",
  },
  {
    id: "ebook-collection",
    name: "Inspirational Life & Purpose Digital Ebook Collection (3 Volumes)",
    price: 1200,
    originalPrice: 1500,
    discountPercent: 20,
    currency: "KES",
    brand: "Uburu Publications",
    tag: "Digital",
    image: ebookCover,
    categorySlug: "uburu-smart-shopper",
    isFolder: true,
    folderItems: ebookProducts,
    rating: 4.9,
    reviewCount: 210,
    inStock: true,
    stockLocation: "Instant Download",
    imageCount: 3,
    description: "Explore our bestselling digital empowerment library. Instant high-resolution PDF download.",
  },
];

export const uburuProduceItems: HomeCategoryItem[] = [
  {
    id: "produce-family-basket",
    name: "Farm-Fresh Organic Harvest Vegetable Crate (10kg Assorted)",
    price: 1850,
    originalPrice: 2200,
    discountPercent: 16,
    currency: "KES",
    brand: "Uburu Farm Cooperative",
    tag: "Fresh Produce",
    image: pic8,
    categorySlug: "uburu-veggies",
    rating: 4.8,
    reviewCount: 76,
    inStock: true,
    stockLocation: "Same-Day Delivery",
    imageCount: 4,
    badge: "FARM FRESH",
    description: "Hand-picked organic spinach, kale, carrots, ripe tomatoes, onions, and crisp seasonal greens.",
  },
  {
    id: "produce-herbs-greens",
    name: "Hydroponic Crisp Lettuce, Basil & Culinary Herb Pack",
    price: 650,
    currency: "KES",
    brand: "Uburu Farm Cooperative",
    tag: "Fresh Greens",
    image: pic9,
    categorySlug: "uburu-veggies",
    rating: 4.7,
    reviewCount: 43,
    inStock: true,
    stockLocation: "Morning Harvest",
    imageCount: 2,
    description: "Pesticide-free hydroponic culinary herbs, coriander, rosemary, and sweet bell peppers.",
  },
];

export const uburuPantryItems: HomeCategoryItem[] = [
  {
    id: "pantry-whole-grains",
    name: "Unrefined Whole Grain Flours & Dry Legumes Bundle (5kg Assorted)",
    price: 1450,
    originalPrice: 1750,
    discountPercent: 17,
    currency: "KES",
    brand: "Uburu Pantry",
    tag: "Food & Staples",
    image: pic9,
    categorySlug: "uburu-food",
    rating: 4.8,
    reviewCount: 88,
    inStock: true,
    stockLocation: "NBO",
    imageCount: 3,
    description: "High-protein unpolished brown lentils, yellow beans, stoneground finger millet flour, and grain sorghum.",
  },
];

export const uburuOfficeItems: HomeCategoryItem[] = [
  {
    id: "office-desk-pack",
    name: "Executive Eco-Friendly Desk Organiser & Hardcover Journal Set",
    price: 1350,
    originalPrice: 1600,
    discountPercent: 15,
    currency: "KES",
    brand: "Uburu Stationery",
    tag: "Workspace",
    image: pic5,
    categorySlug: "uburu-office",
    rating: 4.6,
    reviewCount: 39,
    inStock: true,
    stockLocation: "NBO | KBU",
    imageCount: 2,
    description: "Recycled bamboo desktop stationery organiser, soft-touch ruled journal, and precision writing pens.",
  },
];

export const uburuBeautyItems: HomeCategoryItem[] = [
  {
    id: "beauty-shea-care",
    name: "Pure Cold-Pressed Artisanal Shea Butter & Botanical Body Oil Kit",
    price: 1650,
    originalPrice: 2100,
    discountPercent: 21,
    currency: "KES",
    brand: "Uburu Natural Care",
    tag: "Skincare",
    image: pic11,
    categorySlug: "uburu-beauty",
    rating: 4.9,
    reviewCount: 112,
    inStock: true,
    stockLocation: "NBO",
    imageCount: 3,
    badge: "ORGANIC",
    description: "100% unrefined raw yellow shea butter whipped with pure jojoba, avocado oil, and soothing lavender.",
  },
];

export const uburuKidsItems: HomeCategoryItem[] = [
  {
    id: "kids-learning-kit",
    name: "Creative Kids Art & Early Learning Activity Explorer Pack",
    price: 1100,
    originalPrice: 1400,
    discountPercent: 21,
    currency: "KES",
    brand: "Uburu Kids",
    tag: "Creative Youth",
    image: kidsImage,
    categorySlug: "uburu-kids",
    rating: 4.8,
    reviewCount: 54,
    inStock: true,
    stockLocation: "NBO",
    imageCount: 4,
    description: "Non-toxic finger paints, washable crayons, bilingual storybooks, and interactive wooden puzzle blocks.",
  },
];

export const uburuServiceItems: HomeCategoryItem[] = [
  {
    id: "service-deep-cleaning",
    name: "Home & Office Deep Sanitization & Carpet Scrubbing Service",
    price: 3500,
    originalPrice: 4200,
    discountPercent: 16,
    currency: "KES",
    brand: "Uburu Certified Services",
    tag: "Cleaning",
    image: pic7,
    categorySlug: "uburu-services",
    rating: 4.9,
    reviewCount: 92,
    inStock: true,
    stockLocation: "Nairobi & Environs",
    imageCount: 4,
    badge: "POPULAR",
    description: "Thorough sanitization and top-to-bottom deep scrubbing for apartments, residences, and workspace suites.",
    unit: "From 1-2 Bedroom",
    features: ["Kitchen & appliance degreasing", "Bathroom deep descaling", "Window & floor polish"],
  },
  {
    id: "service-plumbing-electrical",
    name: "Certified Plumbing Diagnostics & Electrical Maintenance Callout",
    price: 2000,
    currency: "KES",
    brand: "Uburu Certified Services",
    tag: "Repairs",
    image: pic4,
    categorySlug: "uburu-services",
    rating: 4.8,
    reviewCount: 67,
    inStock: true,
    stockLocation: "Same-Day Dispatch",
    imageCount: 3,
    description: "Certified technicians for leak fixes, circuit troubleshooting, socket & switch installations, and water heater repairs.",
    unit: "Base Callout & Assessment",
    features: ["Certified technicians", "Same-day emergency response", "Guaranteed workmanship"],
  },
  {
    id: "service-carpentry-furniture",
    name: "Precision Wood Carpentry & Custom Furniture Fitting Assembly",
    price: 2500,
    currency: "KES",
    brand: "Uburu Certified Services",
    tag: "Carpentry",
    image: pic5,
    categorySlug: "uburu-services",
    rating: 4.7,
    reviewCount: 41,
    inStock: true,
    stockLocation: "NBO",
    imageCount: 3,
    description: "Custom shelving, door realignment, hinge replacements, wardrobe repairs, and flat-pack furniture assembly.",
    unit: "Per Job Assessment",
    features: ["Custom fittings", "Precision wood repair", "Hardware replacement"],
  },
  {
    id: "service-painting-wallcare",
    name: "Interior Wall Preparation & Premium Architectural Painting",
    price: 4500,
    originalPrice: 5500,
    discountPercent: 18,
    currency: "KES",
    brand: "Uburu Certified Services",
    tag: "Painting",
    image: pic1,
    categorySlug: "uburu-services",
    rating: 4.9,
    reviewCount: 53,
    inStock: true,
    stockLocation: "NBO | KBU",
    imageCount: 3,
    description: "Flawless wall preparation, crack filling, moisture treatment, and premium color coating for fresh living spaces.",
    unit: "Starting per Room",
    features: ["Crack & moisture treatment", "Clean tape masking", "Fast-drying premium finish"],
  },
];

export const homeCategories: HomeCategory[] = [
  {
    id: "uburu-smart-shopper",
    slug: "uburu-smart-shopper",
    name: "Uburu Smart Shopper",
    shortName: "Smart Shopper",
    tagline: "Smart value bundles, apparel, and curated family essentials.",
    description: "Curated everyday essentials, inspirational books, and signature apparel tailored for your lifestyle.",
    type: "product",
    iconName: "ShoppingCart",
    accentColor: "from-amber-500 to-yellow-400",
    highlightImage: pic1,
    items: originalSmartShopperItems,
  },
  {
    id: "uburu-veggies",
    slug: "uburu-veggies",
    name: "Uburu Veggies",
    shortName: "Veggies",
    tagline: "Farm fresh organic vegetables straight to your doorstep.",
    description: "Nutritious, organically grown local vegetables sourced directly from sustainable community farm projects.",
    type: "product",
    iconName: "Carrot",
    accentColor: "from-emerald-600 to-green-400",
    highlightImage: pic8,
    items: uburuProduceItems,
  },
  {
    id: "uburu-food",
    slug: "uburu-food",
    name: "Uburu Food",
    shortName: "Food & Pantry",
    tagline: "Good food, good life. Whole grains and pantry staples.",
    description: "Quality grains, pulses, flours, and pantry essentials that keep families well-nourished.",
    type: "product",
    iconName: "UtensilsCrossed",
    accentColor: "from-amber-600 to-orange-400",
    highlightImage: pic9,
    items: uburuPantryItems,
  },
  {
    id: "uburu-office",
    slug: "uburu-office",
    name: "Uburu Office",
    shortName: "Office & Desk",
    tagline: "Productivity essentials, stationery, and workspace supplies.",
    description: "Quality stationery, paper products, desk organizers, and office consumables supporting productive workspaces.",
    type: "product",
    iconName: "Briefcase",
    accentColor: "from-blue-600 to-cyan-400",
    highlightImage: pic5,
    items: uburuOfficeItems,
  },
  {
    id: "uburu-beauty",
    slug: "uburu-beauty",
    name: "Uburu Beauty",
    shortName: "Beauty & Care",
    tagline: "Natural skincare, organic soaps, and pure botanical wellness.",
    description: "Handcrafted shea butters, artisanal soaps, natural body oils, and non-toxic self-care products.",
    type: "product",
    iconName: "Sparkles",
    accentColor: "from-rose-500 to-pink-400",
    highlightImage: pic11,
    items: uburuBeautyItems,
  },
  {
    id: "uburu-kids",
    slug: "uburu-kids",
    name: "Uburu Kids",
    shortName: "Kids & Youth",
    tagline: "Creative learning materials, games, and children essentials.",
    description: "Educational toys, creative art supplies, storybooks, and comfortable daily items for growing kids.",
    type: "product",
    iconName: "Baby",
    accentColor: "from-amber-400 to-yellow-300",
    highlightImage: kidsImage,
    items: uburuKidsItems,
  },
  {
    id: "uburu-household",
    slug: "uburu-household",
    name: "Uburu Household",
    shortName: "Household",
    tagline: "Bedding, homeware, cleaning supplies, and home comforts.",
    description: "Durable home utilities, cozy blankets, eco-friendly cleaning detergents, and essential housewares.",
    type: "product",
    iconName: "Home",
    accentColor: "from-teal-600 to-emerald-400",
    highlightImage: pic8,
    items: originalSmartShopperItems.filter(item => item.id === "reusable-bottles"),
  },
  {
    id: "uburu-services",
    slug: "uburu-services",
    name: "Uburu Services",
    shortName: "Services",
    tagline: "Repairs, home maintenance, deep cleaning, and skilled trades.",
    description: "Vetted professional home services delivered by certified community technicians and service experts.",
    type: "service",
    iconName: "Wrench",
    accentColor: "from-amber-500 to-red-500",
    highlightImage: pic7,
    items: uburuServiceItems,
  },
  {
    id: "uburu-souvenirs",
    slug: "uburu-souvenirs",
    name: "Uburu Souvenirs",
    shortName: "Souvenirs & Art",
    tagline: "Authentic handcrafted cultural keepsakes and indigenous art.",
    description: "Unique beaded jewelry, wood carvings, soapstone sculptures, and hand-woven artisanal goods.",
    type: "product",
    iconName: "Gift",
    accentColor: "from-purple-600 to-pink-500",
    highlightImage: pic11,
    items: [],
  },
  {
    id: "uburu-medical",
    slug: "uburu-medical",
    name: "Uburu Medical",
    shortName: "Medical & Health",
    tagline: "First-aid essentials, wellness kits, and home health care.",
    description: "Comprehensive first-aid boxes, digital thermometers, diagnostic supplies, and basic wellness essentials.",
    type: "product",
    iconName: "Stethoscope",
    accentColor: "from-red-600 to-rose-400",
    highlightImage: pic3,
    items: [],
  },
  {
    id: "uburu-clothing",
    slug: "uburu-clothing",
    name: "Uburu Clothing",
    shortName: "Clothing & Apparel",
    tagline: "Premium everyday style. Quality tees, hoodies, and headwear.",
    description: "Comfortable premium apparel made from breathable heavy-weight cotton designed for everyday wear.",
    type: "product",
    iconName: "Shirt",
    accentColor: "from-yellow-500 to-amber-300",
    highlightImage: shirt,
    items: originalSmartShopperItems.filter(item => item.id !== "ebook-collection" && item.id !== "reusable-bottles"),
  },
  {
    id: "uburu-construction",
    slug: "uburu-construction",
    name: "Uburu Construction",
    shortName: "Construction & Tools",
    tagline: "Hardware, tools, building materials, and repair supplies.",
    description: "High-grade cement, treated timber, heavy-duty hand tools, fasteners, and safety gear.",
    type: "product",
    iconName: "HardHat",
    accentColor: "from-amber-600 to-stone-500",
    highlightImage: pic4,
    items: [],
  },
];

// Helper to get category by slug or ID
export const getCategoryBySlug = (slugOrId: string): HomeCategory | undefined => {
  return homeCategories.find(
    (cat) => cat.slug.toLowerCase() === slugOrId.toLowerCase() || cat.id.toLowerCase() === slugOrId.toLowerCase()
  );
};

// Flatten all items across all categories for checkout catalog
export const allCategoryProducts: StorefrontItem[] = homeCategories.flatMap(
  (category) => category.items
);


import type { StorefrontItem } from "./storefrontCatalog";

import ebook1 from "../assets/ebook1.jpg";
import ebook2 from "../assets/ebook2.jpg";
import ebook3 from "../assets/ebook3.jpg";
import ebookCover from "../assets/ebook.webp";
import shirt from "../assets/shirt.webp";
import cap from "../assets/cap.webp";
import hoodie from "../assets/hoodie.webp";
import waterBottle from "../assets/waterbottle.webp";

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

export const uburuSouvenirItems: HomeCategoryItem[] = [
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
    categorySlug: "uburu-souvenirs",
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
    categorySlug: "uburu-souvenirs",
    rating: 4.7,
    reviewCount: 98,
    inStock: true,
    stockLocation: "NBO",
    hasColorOptions: true,
    imageCount: 3,
    description: "100% combed ring-spun organic cotton unisex tees tailored for everyday comfort and premium durability.",
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
    categorySlug: "uburu-souvenirs",
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
    categorySlug: "uburu-souvenirs",
    rating: 4.9,
    reviewCount: 184,
    inStock: true,
    stockLocation: "NBO",
    hasColorOptions: true,
    imageCount: 3,
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
    categorySlug: "uburu-souvenirs",
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

export const originalSmartShopperItems: HomeCategoryItem[] = [];
export const uburuProduceItems: HomeCategoryItem[] = [];
export const uburuPantryItems: HomeCategoryItem[] = [];
export const uburuOfficeItems: HomeCategoryItem[] = [];
export const uburuBeautyItems: HomeCategoryItem[] = [];
export const uburuKidsItems: HomeCategoryItem[] = [];
export const uburuServiceItems: HomeCategoryItem[] = [];

export const homeCategories: HomeCategory[] = [
  {
    id: "uburu-smart-shopper",
    slug: "uburu-smart-shopper",
    name: "Uburu Smart Shopper",
    shortName: "Supermarket",
    tagline: "Your online supermarket for groceries, household goods, and daily provisions.",
    description: "A one-stop supermarket experience featuring daily groceries, household provisions, packaged foods, personal care essentials, and family shopping value packs.",
    type: "product",
    iconName: "ShoppingCart",
    accentColor: "from-amber-500 to-yellow-400",
    highlightImage: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80",
    items: [],
  },
  {
    id: "uburu-veggies",
    slug: "uburu-veggies",
    name: "Uburu Veggies",
    shortName: "Veggies",
    tagline: "Farm fresh organic vegetables straight to your doorstep.",
    description: "Nutritious, organically grown local vegetables harvested fresh and delivered daily.",
    type: "product",
    iconName: "Carrot",
    accentColor: "from-emerald-600 to-green-400",
    highlightImage: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80",
    items: [],
  },
  {
    id: "uburu-food",
    slug: "uburu-food",
    name: "Uburu Food",
    shortName: "Hot Meals & Fast Food",
    tagline: "Freshly prepared food from hotels and restaurants like fast food.",
    description: "Delicious freshly prepared dishes from top hotels, restaurants, and fast food spots—featuring gourmet burgers, crispy chicken, hotel-style biryani, artisan pizzas, and hot takeout delivered fresh to your door.",
    type: "product",
    iconName: "UtensilsCrossed",
    accentColor: "from-amber-600 to-orange-400",
    highlightImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    items: [],
  },
  {
    id: "uburu-office",
    slug: "uburu-office",
    name: "Uburu Office",
    shortName: "Office & Desk",
    tagline: "Productivity essentials, stationery, and workspace supplies.",
    description: "Quality stationery, notebooks, desk organizers, and office consumables for modern professionals.",
    type: "product",
    iconName: "Briefcase",
    accentColor: "from-blue-600 to-cyan-400",
    highlightImage: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80",
    items: [],
  },
  {
    id: "uburu-beauty",
    slug: "uburu-beauty",
    name: "Uburu Beauty",
    shortName: "Beauty & Care",
    tagline: "Natural skincare, organic soaps, and pure botanical wellness.",
    description: "Handcrafted pure shea butters, botanical body oils, and natural daily self-care formulations.",
    type: "product",
    iconName: "Sparkles",
    accentColor: "from-rose-500 to-pink-400",
    highlightImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    items: [],
  },
  {
    id: "uburu-kids",
    slug: "uburu-kids",
    name: "Uburu Kids",
    shortName: "Kids & Youth",
    tagline: "Creative learning materials, games, and children essentials.",
    description: "Educational toys, creative art supplies, storybooks, and comfortable daily items for growing children.",
    type: "product",
    iconName: "Baby",
    accentColor: "from-amber-400 to-yellow-300",
    highlightImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    items: [],
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
    highlightImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    items: [],
  },
  {
    id: "uburu-services",
    slug: "uburu-services",
    name: "Uburu Services",
    shortName: "Services",
    tagline: "Repairs, home maintenance, deep cleaning, and skilled trades.",
    description: "On-demand vetted home maintenance, deep cleaning, electrical diagnostics, and skilled trade professionals.",
    type: "service",
    iconName: "Wrench",
    accentColor: "from-amber-500 to-red-500",
    highlightImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    items: [],
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
    highlightImage: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80",
    items: uburuSouvenirItems,
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
    highlightImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
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
    highlightImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
    items: [],
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
    highlightImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
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

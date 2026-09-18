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
  description?: string;
  rating?: number;
  badge?: string;
  features?: string[];
  unit?: string;
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
    id: "ebook-collection",
    name: "Ebook Collection",
    price: 1200,
    currency: "KES",
    tag: "Digital",
    image: ebookCover,
    categorySlug: "uburu-smart-shopper",
    isFolder: true,
    folderItems: ebookProducts,
    description: "Explore our digital library. Select individual titles to support our cause.",
  },
  {
    id: "tshirts",
    name: "T-shirts",
    price: 1000,
    currency: "KES",
    tag: "Apparel",
    image: shirt,
    categorySlug: "uburu-smart-shopper",
    description: "Premium cotton apparel supporting shelter and rehabilitation programs.",
  },
  {
    id: "caps",
    name: "Caps",
    price: 900,
    currency: "KES",
    tag: "Everyday",
    image: cap,
    categorySlug: "uburu-smart-shopper",
    description: "Classic structured 6-panel cap with high quality embroidery.",
  },
  {
    id: "hoodies",
    name: "Hoodies",
    price: 2800,
    currency: "KES",
    tag: "Cozy",
    image: hoodie,
    categorySlug: "uburu-smart-shopper",
    description: "Comfortable heavyweight fleece hoodie built for everyday warmth.",
  },
  {
    id: "reusable-bottles",
    name: "Reusable bottles",
    price: 1500,
    currency: "KES",
    tag: "Eco",
    image: waterBottle,
    categorySlug: "uburu-smart-shopper",
    description: "Insulated eco-friendly water bottle keeping drinks cold or hot.",
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
    items: [],
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
    items: [],
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
    items: [],
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
    items: [],
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
    highlightImage: pic8,
    items: [],
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
    items: originalSmartShopperItems.filter(item => item.id !== "ebook-collection"),
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

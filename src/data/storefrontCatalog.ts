import ebook1 from "../assets/ebook1.jpg";
import ebook2 from "../assets/ebook2.jpg";
import ebook3 from "../assets/ebook3.jpg";
import ebookCover from "../assets/ebook.webp";
import shirt from "../assets/shirt.webp";
import cap from "../assets/cap.webp";
import hoodie from "../assets/hoodie.webp";
import waterBottle from "../assets/waterbottle.webp";
import culturalEvent from "../assets/Screenshot-2026-02-20_10-06-49.webp";
import communityPainting from "../assets/community-painting-wood-medium-shot.webp";
import footballCircle from "../assets/top-view-childs-feet-around-football-ball.webp";
import olooluaNatureTrail from "../assets/oloolua.webp";
import therapeuticTripImage from "../assets/event3.avif";

export type StorefrontSource = "home" | "village";

export type CurrencyCode = "KES" | "USD";

export type StorefrontItem = {
  id: string;
  name: string;
  price: number;
  currency: CurrencyCode;
  tag: string;
  image: string;
  isFolder?: boolean;
  folderItems?: StorefrontItem[];
};

export const homeApparelColorOptions = ["White", "Yellow", "Grey", "Green", "Blue"] as const;

export type HomeApparelColor = (typeof homeApparelColorOptions)[number];

export const homeLogoOptions = ["With logo", "Without logo"] as const;

export type HomeLogoOption = (typeof homeLogoOptions)[number];

export const homeColorConfigurableProductIds = ["tshirts", "caps", "hoodies"] as const;

export const homeBrandingConfigurableProductIds = [
  "tshirts",
  "caps",
  "hoodies",
  "reusable-bottles",
] as const;

export type VillageTravelMonth = "july" | "august" | "september" | "october";

export type VillageResidencyType = "resident" | "non_resident";

export type VillageCampRate = {
  campId: string;
  campName: string;
  mealPlanLabel: string;
  availableMonths: VillageTravelMonth[];
  residentPriceKes: number;
  nonResidentPriceUsd: number;
  image: string;
};

export type VillageEventOption = StorefrontItem & {
  packageId: string;
  campId: string;
  campName: string;
  residencyType: VillageResidencyType;
  mealPlanLabel: string;
  availableMonths: VillageTravelMonth[];
};

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

export const homeProducts: StorefrontItem[] = [
  ...ebookProducts,
  {
    id: "tshirts",
    name: "T-shirts",
    price: 1000,
    currency: "KES",
    tag: "Apparel",
    image: shirt,
  },
  {
    id: "caps",
    name: "Caps",
    price: 900,
    currency: "KES",
    tag: "Everyday",
    image: cap,
  },
  {
    id: "hoodies",
    name: "Hoodies",
    price: 2800,
    currency: "KES",
    tag: "Cozy",
    image: hoodie,
  },
  {
    id: "reusable-bottles",
    name: "Reusable bottles",
    price: 1500,
    currency: "KES",
    tag: "Eco",
    image: waterBottle,
  },
];

export const homeFeaturedProducts: StorefrontItem[] = [
  {
    id: "ebook-collection",
    name: "Ebook Collection",
    price: 1200,
    currency: "KES",
    tag: "Digital",
    image: ebookCover,
    isFolder: true,
    folderItems: ebookProducts,
  },
  {
    id: "tshirts",
    name: "T-shirts",
    price: 1000,
    currency: "KES",
    tag: "Apparel",
    image: shirt,
  },
  {
    id: "caps",
    name: "Caps",
    price: 900,
    currency: "KES",
    tag: "Everyday",
    image: cap,
  },
  {
    id: "hoodies",
    name: "Hoodies",
    price: 2800,
    currency: "KES",
    tag: "Cozy",
    image: hoodie,
  },
  {
    id: "reusable-bottles",
    name: "Reusable bottles",
    price: 1500,
    currency: "KES",
    tag: "Eco",
    image: waterBottle,
  },
];

export const villageCampRates: VillageCampRate[] = [
  {
    campId: "mara-budget-camps",
    campName: "Mara Budget Camps",
    mealPlanLabel: "July - Oct",
    availableMonths: ["july", "august", "september", "october"],
    residentPriceKes: 27500,
    nonResidentPriceUsd: 250,
    image: olooluaNatureTrail,
  },
  {
    campId: "kipekee-zuri-camp",
    campName: "Kipekee Zuri Camp",
    mealPlanLabel: "July - Oct",
    availableMonths: ["july", "august", "september", "october"],
    residentPriceKes: 44300,
    nonResidentPriceUsd: 330,
    image: culturalEvent,
  },
  {
    campId: "enkorok-mara-camp",
    campName: "Enkorok Mara Camp",
    mealPlanLabel: "July - Sept",
    availableMonths: ["july", "august", "september"],
    residentPriceKes: 46300,
    nonResidentPriceUsd: 360,
    image: communityPainting,
  },
  {
    campId: "mara-chui-resort",
    campName: "Mara Chui Resort",
    mealPlanLabel: "July - Sept",
    availableMonths: ["july", "august", "september"],
    residentPriceKes: 46300,
    nonResidentPriceUsd: 360,
    image: footballCircle,
  },
  {
    campId: "enkorok-safari-camp",
    campName: "Enkorok Safari Camp",
    mealPlanLabel: "July - Sept",
    availableMonths: ["july", "august", "september"],
    residentPriceKes: 57600,
    nonResidentPriceUsd: 495,
    image: olooluaNatureTrail,
  },
  {
    campId: "jambo-mara-safari-lodge",
    campName: "Jambo Mara Safari Lodge",
    mealPlanLabel: "July - Aug",
    availableMonths: ["july", "august"],
    residentPriceKes: 59000,
    nonResidentPriceUsd: 595,
    image: footballCircle,
  },
  {
    campId: "mara-sopa-lodge",
    campName: "Mara Sopa Lodge",
    mealPlanLabel: "July - Aug",
    availableMonths: ["july", "august"],
    residentPriceKes: 61500,
    nonResidentPriceUsd: 680,
    image: culturalEvent,
  },
  {
    campId: "emayian-luxury-camp",
    campName: "Emayian Luxury Camp",
    mealPlanLabel: "July - Aug",
    availableMonths: ["july", "august"],
    residentPriceKes: 63600,
    nonResidentPriceUsd: 680,
    image: communityPainting,
  },
  {
    campId: "alama-mara-camp",
    campName: "Alama Mara Camp",
    mealPlanLabel: "July - Sept",
    availableMonths: ["july", "august", "september"],
    residentPriceKes: 71300,
    nonResidentPriceUsd: 800,
    image: culturalEvent,
  },
];

export const villageEventOptions: VillageEventOption[] = villageCampRates.flatMap(
  (camp) => [
    {
      id: `${camp.campId}-resident`,
      packageId: "maasai-mara-daily-group-departures-2026",
      campId: camp.campId,
      campName: camp.campName,
      residencyType: "resident",
      mealPlanLabel: camp.mealPlanLabel,
      availableMonths: camp.availableMonths,
      name: `${camp.campName} (Resident)`,
      price: camp.residentPriceKes,
      currency: "KES",
      tag: "Resident",
      image: camp.image,
    },
    {
      id: `${camp.campId}-non-resident`,
      packageId: "maasai-mara-daily-group-departures-2026",
      campId: camp.campId,
      campName: camp.campName,
      residencyType: "non_resident",
      mealPlanLabel: camp.mealPlanLabel,
      availableMonths: camp.availableMonths,
      name: `${camp.campName} (Non-resident)`,
      price: camp.nonResidentPriceUsd,
      currency: "USD",
      tag: "Non-resident",
      image: camp.image,
    },
  ],
);

villageEventOptions.push({
  id: "oloolua-nature-trail-group",
  packageId: "oloolua-nature-trail",
  campId: "oloolua-nature-trail",
  campName: "Oloolua nature trail",
  residencyType: "resident",
  mealPlanLabel: "All year",
  availableMonths: ["july", "august", "september", "october"],
  name: "Oloolua nature trail (Group 5+)",
  price: 1500,
  currency: "KES",
  tag: "Group 5+",
  image: olooluaNatureTrail,
});

villageEventOptions.push(
  {
    id: "therapeutic-trip-resident",
    packageId: "therapeutic-trip",
    campId: "therapeutic-trip",
    campName: "Therapeutic trip",
    residencyType: "resident",
    mealPlanLabel: "All year",
    availableMonths: ["july", "august", "september", "october"],
    name: "Therapeutic trip (Resident)",
    price: 3000,
    currency: "KES",
    tag: "Resident",
    image: therapeuticTripImage,
  },
  {
    id: "therapeutic-trip-non-resident",
    packageId: "therapeutic-trip",
    campId: "therapeutic-trip",
    campName: "Therapeutic trip",
    residencyType: "non_resident",
    mealPlanLabel: "All year",
    availableMonths: ["july", "august", "september", "october"],
    name: "Therapeutic trip (Non-resident)",
    price: 65,
    currency: "USD",
    tag: "Non-resident",
    image: therapeuticTripImage,
  },
);

export const villageEvents: StorefrontItem[] = villageEventOptions;

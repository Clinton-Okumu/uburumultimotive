import ebook from "../assets/ebook.webp";
import shirt from "../assets/shirt.webp";
import cap from "../assets/cap.webp";
import hoodie from "../assets/hoodie.webp";
import waterBottle from "../assets/waterbottle.webp";
import culturalEvent from "../assets/Screenshot-2026-02-20_10-06-49.webp";
import communityPainting from "../assets/community-painting-wood-medium-shot.webp";
import footballCircle from "../assets/top-view-childs-feet-around-football-ball.webp";
import charityHome from "../assets/pic20.webp";

export type StorefrontSource = "home" | "village";

export type StorefrontItem = {
  id: string;
  name: string;
  price: number;
  tag: string;
  image: string;
};

export const homeProducts: StorefrontItem[] = [
  {
    id: "ebooks",
    name: "Ebooks",
    price: 1200,
    tag: "Digital",
    image: ebook,
  },
  {
    id: "tshirts",
    name: "T-shirts",
    price: 1800,
    tag: "Apparel",
    image: shirt,
  },
  {
    id: "caps",
    name: "Caps",
    price: 900,
    tag: "Everyday",
    image: cap,
  },
  {
    id: "hoodies",
    name: "Hoodies",
    price: 2800,
    tag: "Cozy",
    image: hoodie,
  },
  {
    id: "reusable-bottles",
    name: "Reusable bottles",
    price: 1500,
    tag: "Eco",
    image: waterBottle,
  },
];

export const villageEvents: StorefrontItem[] = [
  {
    id: "charity-home",
    name: "Charity home",
    price: 1500,
    tag: "Care",
    image: charityHome,
  },
  {
    id: "gala-dinner",
    name: "Cultural concert/performance",
    price: 4500,
    tag: "Live",
    image: culturalEvent,
  },
  {
    id: "quiz-evening",
    name: "Quiz evening",
    price: 1200,
    tag: "Interactive",
    image: communityPainting,
  },
  {
    id: "sport-tournaments",
    name: "Sport tournaments",
    price: 2000,
    tag: "All ages",
    image: footballCircle,
  },
];

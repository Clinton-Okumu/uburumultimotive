import ebook from "../assets/ebook.webp";
import shirt from "../assets/shirt.webp";
import cap from "../assets/cap.webp";
import hoodie from "../assets/hoodie.webp";
import waterBottle from "../assets/waterbottle.webp";
import culturalEvent from "../assets/Screenshot-2026-02-20_10-06-49.webp";
import communityPainting from "../assets/community-painting-wood-medium-shot.webp";
import footballCircle from "../assets/top-view-childs-feet-around-football-ball.webp";
import olooluaNatureTrail from "../assets/uburuvillge2.webp";

export type StorefrontSource = "home" | "village";

export type StorefrontItem = {
  id: string;
  name: string;
  price: number;
  tag: string;
  image: string;
};

export type VillageTicketType = "individual" | "group";

export type VillageEventOption = StorefrontItem & {
  baseEventId: string;
  ticketType: VillageTicketType;
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

const villageBaseEvents: StorefrontItem[] = [
  {
    id: "charity-home",
    name: "Oloolua nature trail",
    price: 1500,
    tag: "Care",
    image: olooluaNatureTrail,
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

export const villageEventOptions: VillageEventOption[] = villageBaseEvents.flatMap(
  (event) => [
    {
      id: `${event.id}-individual`,
      baseEventId: event.id,
      ticketType: "individual",
      name: `${event.name} (Individual)`,
      price: event.price,
      tag: "Individual",
      image: event.image,
    },
    {
      id: `${event.id}-group`,
      baseEventId: event.id,
      ticketType: "group",
      name: `${event.name} (Group of 5)`,
      price: event.price * 5,
      tag: "Group of 5",
      image: event.image,
    },
  ],
);

export const villageEvents: StorefrontItem[] = villageEventOptions;

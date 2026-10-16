import { getAdminAuthHeader } from '../auth/AdminAuthContext';
import olooluaNatureTrail from '../../assets/oloolua.webp';
import kidsImage from '../../assets/kids.webp';
import therapeuticTripImage from '../../assets/glassdoor2.webp';
import paradiseLostImage from '../../assets/paradiselost.jpg';
import kitengelaGlassImage from '../../assets/kitengelaglass.webp';

export interface VillageExperience {
    id: string;
    title: string;
    tag: string;
    description: string;
    location: string;
    duration: string;
    image: string;
    priceKes: number;
    priceUsd?: number;
    minPeople: number;
    optionId: string;
    isActive: boolean;
    isFeatured?: boolean;
    highlights?: string[];
}

export interface VillageCampRateConfig {
    campId: string;
    campName: string;
    mealPlanLabel: string;
    availableMonths: ('july' | 'august' | 'september' | 'october')[];
    residentPriceKes: number;
    nonResidentPriceUsd: number;
    image?: string;
    isActive: boolean;
}

export const VILLAGE_EXPERIENCES_STORAGE_KEY = 'uburu_admin_village_experiences_v1';
export const VILLAGE_CAMPS_STORAGE_KEY = 'uburu_admin_village_camps_v1';
export const VILLAGE_CONFIG_EVENT = 'uburu_village_config_updated';

export const INITIAL_VILLAGE_EXPERIENCES: VillageExperience[] = [
    {
        id: 'oloolua-nature-trail',
        title: 'Oloolua Nature Trail',
        tag: 'Eco Walk',
        description: 'Guided scenic hike through waterfalls, caves, and indigenous forest canopy.',
        location: 'Karen, Nairobi',
        duration: 'Full Day (8:00 AM - 4:00 PM)',
        image: olooluaNatureTrail,
        priceKes: 4000,
        priceUsd: 40,
        minPeople: 5,
        optionId: 'oloolua-nature-trail-group',
        isActive: true,
        isFeatured: true,
        highlights: [
            'Guided indigenous forest walk',
            'Waterfall & Mau Mau cave exploration',
            'Outdoor mindfulness reflection circle',
            'Roundtrip transport & hydration pack',
        ],
    },
    {
        id: 'kids-outdoor-adventure',
        title: 'Kids Outdoor & Wellness Adventure',
        tag: 'Youth & Kids',
        description: 'Outdoor fun, arts & mindfulness designed specifically for children.',
        location: 'Kitengela & Environs',
        duration: 'Day Program (9:00 AM - 3:30 PM)',
        image: kidsImage,
        priceKes: 3500,
        priceUsd: 35,
        minPeople: 1,
        optionId: 'kids-outdoor-adventure-resident',
        isActive: true,
        isFeatured: true,
        highlights: [
            'Team building & nature games',
            'Safe, vetted outdoor environment',
            'Creative arts & expression workshop',
            'Nutritious snacks and refreshments included',
        ],
    },
    {
        id: 'therapeutic-trip',
        title: 'Therapeutic Trip to Kitengela Glass',
        tag: 'Art & Healing',
        description: 'Restorative excursion exploring mosaic art pathways, glass studios, and suspension bridges.',
        location: 'Kitengela Hot Glass',
        duration: 'Full Day Outing',
        image: therapeuticTripImage,
        priceKes: 4500,
        priceUsd: 45,
        minPeople: 1,
        optionId: 'therapeutic-trip-resident',
        isActive: true,
        isFeatured: true,
        highlights: [
            'Live glassblowing demonstration',
            'Suspension bridge gorge crossing',
            'Therapeutic sharing & relaxation circle',
            'All entrance fees & guide included',
        ],
    },
    {
        id: 'paradise-lost',
        title: 'Paradise Lost Excursion',
        tag: 'Nature Sanctuary',
        description: 'Refreshing sanctuary with prehistoric caves, coffee farm walks, and tranquil lake.',
        location: 'Kiambu Road',
        duration: 'Day Retreat',
        image: paradiseLostImage,
        priceKes: 3500,
        priceUsd: 35,
        minPeople: 1,
        optionId: 'paradise-lost-resident',
        isActive: true,
        isFeatured: false,
        highlights: [
            'Prehistoric Stone Age cave exploration',
            'Boat riding on serene lake',
            'Coffee farm educational walk',
            'Picnic lunch and reflection group',
        ],
    },
    {
        id: 'kids-kitengela-glass',
        title: 'Kids Kitengela Glass Adventure',
        tag: 'Youth Discovery',
        description: 'Glass art discovery, suspension bridge walk, creative crafts, and mindfulness for kids.',
        location: 'Kitengela Hot Glass',
        duration: 'Day Trip (9:00 AM - 4:00 PM)',
        image: kitengelaGlassImage,
        priceKes: 4500,
        priceUsd: 45,
        minPeople: 1,
        optionId: 'kids-kitengela-glass-resident',
        isActive: true,
        isFeatured: false,
        highlights: [
            'Glass craft observation & learning',
            'Suspension bridge walk with guides',
            'Creative mindfulness and team bonding',
            'Full lunch and beverage included',
        ],
    },
];

export const INITIAL_VILLAGE_CAMPS: VillageCampRateConfig[] = [
    {
        campId: 'mara-budget-camps',
        campName: 'Mara Budget Camps',
        mealPlanLabel: 'July - Oct',
        availableMonths: ['july', 'august', 'september', 'october'],
        residentPriceKes: 27500,
        nonResidentPriceUsd: 250,
        isActive: true,
    },
    {
        campId: 'kipekee-zuri-camp',
        campName: 'Kipekee Zuri Camp',
        mealPlanLabel: 'July - Oct',
        availableMonths: ['july', 'august', 'september', 'october'],
        residentPriceKes: 44300,
        nonResidentPriceUsd: 330,
        isActive: true,
    },
    {
        campId: 'enkorok-mara-camp',
        campName: 'Enkorok Mara Camp',
        mealPlanLabel: 'July - Sept',
        availableMonths: ['july', 'august', 'september'],
        residentPriceKes: 46300,
        nonResidentPriceUsd: 360,
        isActive: true,
    },
    {
        campId: 'mara-chui-resort',
        campName: 'Mara Chui Resort',
        mealPlanLabel: 'July - Sept',
        availableMonths: ['july', 'august', 'september'],
        residentPriceKes: 46300,
        nonResidentPriceUsd: 360,
        isActive: true,
    },
    {
        campId: 'enkorok-safari-camp',
        campName: 'Enkorok Safari Camp',
        mealPlanLabel: 'July - Sept',
        availableMonths: ['july', 'august', 'september'],
        residentPriceKes: 57600,
        nonResidentPriceUsd: 495,
        isActive: true,
    },
    {
        campId: 'jambo-mara-safari-lodge',
        campName: 'Jambo Mara Safari Lodge',
        mealPlanLabel: 'July - Aug',
        availableMonths: ['july', 'august'],
        residentPriceKes: 59000,
        nonResidentPriceUsd: 595,
        isActive: true,
    },
    {
        campId: 'mara-sopa-lodge',
        campName: 'Mara Sopa Lodge',
        mealPlanLabel: 'July - Aug',
        availableMonths: ['july', 'august'],
        residentPriceKes: 61500,
        nonResidentPriceUsd: 680,
        isActive: true,
    },
    {
        campId: 'emayian-luxury-camp',
        campName: 'Emayian Luxury Camp',
        mealPlanLabel: 'July - Aug',
        availableMonths: ['july', 'august'],
        residentPriceKes: 63600,
        nonResidentPriceUsd: 680,
        isActive: true,
    },
    {
        campId: 'alama-mara-camp',
        campName: 'Alama Mara Camp',
        mealPlanLabel: 'July - Sept',
        availableMonths: ['july', 'august', 'september'],
        residentPriceKes: 71300,
        nonResidentPriceUsd: 800,
        isActive: true,
    },
];

/**
 * Loads stored village experiences or defaults
 */
export const getStoredVillageExperiences = (): VillageExperience[] => {
    if (typeof window === 'undefined') return INITIAL_VILLAGE_EXPERIENCES;
    try {
        const raw = localStorage.getItem(VILLAGE_EXPERIENCES_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(VILLAGE_EXPERIENCES_STORAGE_KEY, JSON.stringify(INITIAL_VILLAGE_EXPERIENCES));
            return INITIAL_VILLAGE_EXPERIENCES;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
        console.error('Failed to parse village experiences:', e);
    }
    return INITIAL_VILLAGE_EXPERIENCES;
};

/**
 * Loads stored safari camp rates or defaults
 */
export const getStoredVillageCamps = (): VillageCampRateConfig[] => {
    if (typeof window === 'undefined') return INITIAL_VILLAGE_CAMPS;
    try {
        const raw = localStorage.getItem(VILLAGE_CAMPS_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(VILLAGE_CAMPS_STORAGE_KEY, JSON.stringify(INITIAL_VILLAGE_CAMPS));
            return INITIAL_VILLAGE_CAMPS;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
        console.error('Failed to parse village camps:', e);
    }
    return INITIAL_VILLAGE_CAMPS;
};

/**
 * Saves village experiences to server and updates localStorage
 */
export const saveVillageExperiences = async (events: VillageExperience[]): Promise<void> => {
    const res = await fetch('/api/village/config.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAdminAuthHeader(),
        },
        body: JSON.stringify({ events }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Failed to save village experiences (HTTP ${res.status})`);
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(VILLAGE_EXPERIENCES_STORAGE_KEY, JSON.stringify(events));
        window.dispatchEvent(new CustomEvent(VILLAGE_CONFIG_EVENT, { detail: { events } }));
    }
};

/**
 * Saves safari camp rates to server and updates localStorage
 */
export const saveVillageCamps = async (camps: VillageCampRateConfig[]): Promise<void> => {
    const res = await fetch('/api/village/config.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAdminAuthHeader(),
        },
        body: JSON.stringify({ camps }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Failed to save safari camps (HTTP ${res.status})`);
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(VILLAGE_CAMPS_STORAGE_KEY, JSON.stringify(camps));
        window.dispatchEvent(new CustomEvent(VILLAGE_CONFIG_EVENT, { detail: { camps } }));
    }
};

/**
 * Saves a single experience (create or update)
 */
export const saveVillageExperience = async (item: VillageExperience): Promise<void> => {
    const events = getStoredVillageExperiences();
    const index = events.findIndex((e) => e.id === item.id);
    if (index >= 0) {
        events[index] = item;
    } else {
        events.unshift(item);
    }
    await saveVillageExperiences(events);
};

/**
 * Deletes a single experience by ID
 */
export const deleteVillageExperience = async (id: string): Promise<boolean> => {
    const events = getStoredVillageExperiences();
    const filtered = events.filter((e) => e.id !== id);
    if (filtered.length === events.length) return false;
    await saveVillageExperiences(filtered);
    return true;
};

/**
 * Updates a safari camp rate
 */
export const saveCampRate = async (camp: VillageCampRateConfig): Promise<void> => {
    const camps = getStoredVillageCamps();
    const index = camps.findIndex((c) => c.campId === camp.campId);
    if (index >= 0) {
        camps[index] = camp;
    } else {
        camps.push(camp);
    }
    await saveVillageCamps(camps);
};

/**
 * Syncs village data from database / server JSON into localStorage
 */
export const syncVillageFromDatabase = async (): Promise<{
    events: VillageExperience[];
    camps: VillageCampRateConfig[];
}> => {
    try {
        const res = await fetch('/api/village/config.php');
        if (res.ok) {
            const data = await res.json();
            if (data && data.success) {
                if (Array.isArray(data.events) && data.events.length > 0) {
                    localStorage.setItem(VILLAGE_EXPERIENCES_STORAGE_KEY, JSON.stringify(data.events));
                }
                if (Array.isArray(data.camps) && data.camps.length > 0) {
                    localStorage.setItem(VILLAGE_CAMPS_STORAGE_KEY, JSON.stringify(data.camps));
                }
                window.dispatchEvent(
                    new CustomEvent(VILLAGE_CONFIG_EVENT, {
                        detail: { events: data.events, camps: data.camps },
                    })
                );
                return {
                    events: data.events || getStoredVillageExperiences(),
                    camps: data.camps || getStoredVillageCamps(),
                };
            }
        }
    } catch {
        // Fall back gracefully to local storage
    }
    return {
        events: getStoredVillageExperiences(),
        camps: getStoredVillageCamps(),
    };
};

/**
 * Resets all village experiences and camps to default
 */
export const resetVillageToDefault = async (): Promise<void> => {
    const res = await fetch('/api/village/config.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAdminAuthHeader(),
        },
        body: JSON.stringify({
            events: INITIAL_VILLAGE_EXPERIENCES,
            camps: INITIAL_VILLAGE_CAMPS,
        }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Failed to reset village configuration (HTTP ${res.status})`);
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(VILLAGE_EXPERIENCES_STORAGE_KEY, JSON.stringify(INITIAL_VILLAGE_EXPERIENCES));
        localStorage.setItem(VILLAGE_CAMPS_STORAGE_KEY, JSON.stringify(INITIAL_VILLAGE_CAMPS));
        window.dispatchEvent(
            new CustomEvent(VILLAGE_CONFIG_EVENT, {
                detail: { events: INITIAL_VILLAGE_EXPERIENCES, camps: INITIAL_VILLAGE_CAMPS },
            })
        );
    }
};

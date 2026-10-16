import { getAdminAuthHeader } from '../auth/AdminAuthContext';
import olooluaNatureTrail from '../../assets/oloolua.webp';
import kidsImage from '../../assets/kids.webp';
import therapeuticTripImage from '../../assets/glassdoor2.webp';
import paradiseLostImage from '../../assets/paradiselost.jpg';
import kitengelaGlassImage from '../../assets/kitengelaglass.webp';

export interface VillageEvent {
    id: string;
    title: string;
    tag: string;
    description: string;
    location: string;
    duration?: string;
    image: string;
    price: number;
    priceKes?: number;
    priceUsd?: number;
    currency: 'KES' | 'USD';
    priceLabel?: string;
    datesText?: string;
    availableDates?: string[];
    host?: string;
    minPeople: number;
    ticketName?: string;
    ticketNote?: string;
    highlights?: string[];
    isActive: boolean;
    isFeatured?: boolean;
    createdAt?: number;
    optionId?: string;
}

export type VillageExperience = VillageEvent;

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
export const VILLAGE_EVENTS_STORAGE_KEY = 'uburu_admin_village_experiences_v1';
export const VILLAGE_CAMPS_STORAGE_KEY = 'uburu_admin_village_camps_v1';
export const VILLAGE_CONFIG_EVENT = 'uburu_village_config_updated';
export const VILLAGE_EVENTS_EVENT = 'uburu_village_events_updated';

export const INITIAL_VILLAGE_EXPERIENCES: VillageEvent[] = [
    {
        id: 'oloolua-nature-trail',
        title: 'Oloolua Nature Trail',
        tag: 'Eco Walk',
        description: 'Guided scenic hike through waterfalls, caves, and indigenous forest canopy.',
        location: 'Karen, Nairobi',
        duration: 'Full Day (8:00 AM - 4:00 PM)',
        datesText: 'All year',
        availableDates: [],
        image: olooluaNatureTrail,
        price: 4000,
        priceKes: 4000,
        priceUsd: 40,
        currency: 'KES',
        priceLabel: 'KES 4,000 each',
        minPeople: 5,
        ticketName: 'Group Pass (Min 5 People)',
        ticketNote: 'Group bookings: minimum 5 participants required',
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
        datesText: 'All year',
        availableDates: [],
        image: kidsImage,
        price: 3500,
        priceKes: 3500,
        priceUsd: 35,
        currency: 'KES',
        priceLabel: 'KES 3,500 each',
        minPeople: 1,
        ticketName: 'Youth Explorer Ticket',
        ticketNote: 'Covers guided games, workshop supplies & healthy snacks',
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
        datesText: 'All year',
        availableDates: [],
        image: therapeuticTripImage,
        price: 4500,
        priceKes: 4500,
        priceUsd: 45,
        currency: 'KES',
        priceLabel: 'KES 4,500 each',
        minPeople: 1,
        ticketName: 'Art & Healing Pass',
        ticketNote: 'Includes studio admission, guide, and therapeutic reflection session',
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
        datesText: 'All year',
        availableDates: [],
        image: paradiseLostImage,
        price: 3500,
        priceKes: 3500,
        priceUsd: 35,
        currency: 'KES',
        priceLabel: 'KES 3,500 each',
        minPeople: 1,
        ticketName: 'Sanctuary Retreat Ticket',
        ticketNote: 'Includes park fees, cave entry and guided nature tour',
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
        datesText: 'All year',
        availableDates: [],
        image: kitengelaGlassImage,
        price: 4500,
        priceKes: 4500,
        priceUsd: 45,
        currency: 'KES',
        priceLabel: 'KES 4,500 each',
        minPeople: 1,
        ticketName: 'Junior Glass Discovery Pass',
        ticketNote: 'Guided glass workshop, bridge walk & refreshments',
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

export const INITIAL_VILLAGE_EVENTS = INITIAL_VILLAGE_EXPERIENCES;

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
        const raw = localStorage.getItem(VILLAGE_EXPERIENCES_STORAGE_KEY) || localStorage.getItem('uburu_admin_village_events_v1');
        if (!raw) {
            localStorage.setItem(VILLAGE_EXPERIENCES_STORAGE_KEY, JSON.stringify(INITIAL_VILLAGE_EXPERIENCES));
            return INITIAL_VILLAGE_EXPERIENCES;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item: any) => ({
                ...item,
                price: Number(item.price ?? item.priceKes ?? 0),
                priceKes: Number(item.priceKes ?? item.price ?? 0),
                currency: item.currency || 'KES',
            }));
        }
    } catch (e) {
        console.error('Failed to parse village experiences:', e);
    }
    return INITIAL_VILLAGE_EXPERIENCES;
};

export const getStoredVillageEvents = (): VillageEvent[] => {
    return getStoredVillageExperiences();
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
        localStorage.setItem('uburu_admin_village_events_v1', JSON.stringify(events));
        window.dispatchEvent(new CustomEvent(VILLAGE_CONFIG_EVENT, { detail: { events } }));
        window.dispatchEvent(new CustomEvent(VILLAGE_EVENTS_EVENT, { detail: events }));
    }
};

export const saveVillageEvents = async (events: VillageEvent[]): Promise<void> => {
    return saveVillageExperiences(events);
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
        window.dispatchEvent(
            new CustomEvent(VILLAGE_EVENTS_EVENT, {
                detail: INITIAL_VILLAGE_EXPERIENCES,
            })
        );
    }
};

/**
 * Updates an existing village event by ID.
 */
export const updateVillageEvent = async (
    eventId: string,
    updates: Partial<VillageEvent>
): Promise<boolean> => {
    const events = getStoredVillageExperiences();
    const index = events.findIndex((e) => e.id === eventId);
    if (index === -1) return false;

    const current = events[index];
    const updatedPrice = updates.price !== undefined ? updates.price : (updates.priceKes ?? current.price);
    const updatedCurrency = updates.currency || current.currency;
    const defaultLabel = `${updatedCurrency} ${Number(updatedPrice).toLocaleString()} each`;

    events[index] = {
        ...current,
        ...updates,
        price: updatedPrice,
        priceKes: updates.priceKes ?? updatedPrice,
        priceLabel: updates.priceLabel || (updates.price !== undefined ? defaultLabel : current.priceLabel),
    };

    await saveVillageExperiences(events);
    return true;
};

/**
 * Deletes a village event by ID.
 */
export const deleteVillageEvent = async (eventId: string): Promise<boolean> => {
    return deleteVillageExperience(eventId);
};

/**
 * Resets village events to defaults.
 */
export const resetVillageEventsToDefault = async (): Promise<VillageEvent[]> => {
    await resetVillageToDefault();
    return INITIAL_VILLAGE_EXPERIENCES;
};

/**
 * Syncs village events from backend API.
 */
export const syncVillageEventsFromDatabase = async (): Promise<VillageEvent[]> => {
    const res = await syncVillageFromDatabase();
    return res.events;
};

/**
 * Adds a new village event.
 */
export const addVillageEvent = async (
    eventData: Omit<VillageEvent, 'id'> & { id?: string }
): Promise<{ success: boolean; event: VillageEvent }> => {
    const events = getStoredVillageExperiences();
    const baseSlug = (eventData.id || eventData.title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `village-event-${Date.now()}`;
        
    let slug = baseSlug;
    let counter = 1;
    while (events.some((e) => e.id === slug)) {
        slug = `${baseSlug}-${counter++}`;
    }

    const price = Number(eventData.price || eventData.priceKes || 0);
    const fullEvent: VillageEvent = {
        ...eventData,
        id: slug,
        price,
        priceKes: eventData.priceKes ?? price,
        priceUsd: eventData.priceUsd ?? (eventData.currency === 'USD' ? price : Math.round(price / 130)),
        currency: eventData.currency || 'KES',
        priceLabel: eventData.priceLabel || `${eventData.currency || 'KES'} ${price.toLocaleString()} each`,
        minPeople: eventData.minPeople !== undefined ? Math.max(1, Number(eventData.minPeople)) : 1,
        ticketName: eventData.ticketName || `${eventData.title} Pass`,
        ticketNote: eventData.ticketNote || 'Includes event access & support for Uburu Village',
        highlights: eventData.highlights && eventData.highlights.length > 0 ? eventData.highlights : ['Exclusive experience hosted by Uburu Village'],
        isActive: eventData.isActive !== undefined ? eventData.isActive : true,
        isFeatured: eventData.isFeatured !== undefined ? eventData.isFeatured : true,
        createdAt: Date.now(),
        duration: eventData.duration || 'Full Day',
        optionId: eventData.optionId || `${slug}-ticket`,
    };

    const updated = [fullEvent, ...events];
    await saveVillageExperiences(updated);
    return { success: true, event: fullEvent };
};

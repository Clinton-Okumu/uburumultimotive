import olooluaNatureTrail from '../../assets/oloolua.webp';
import kidsImage from '../../assets/kids.webp';
import glassdoor2Image from '../../assets/glassdoor2.webp';
import paradiseLostImage from '../../assets/paradiselost.jpg';
import kitengelaGlassImage from '../../assets/kitengelaglass.webp';
import maaImage from '../../assets/maa.webp';
import type { VillageEventOption } from '../../data/storefrontCatalog';

export interface VillageEvent {
    id: string; // e.g. 'oloolua-nature-trail'
    title: string;
    image: string;
    tag: string;
    price: number;
    currency: 'KES' | 'USD';
    priceLabel?: string;
    description: string;
    location: string;
    datesText?: string;
    availableDates?: string[];
    host?: string;
    minPeople?: number;
    ticketName?: string;
    ticketNote?: string;
    highlights?: string[];
    isActive: boolean;
    isFeatured?: boolean;
    createdAt?: number;
    optionId?: string;
}

export const VILLAGE_EVENTS_STORAGE_KEY = 'uburu_admin_village_events_v1';
export const VILLAGE_EVENTS_EVENT = 'uburu_village_events_updated';

export const INITIAL_VILLAGE_EVENTS: VillageEvent[] = [
    {
        id: 'oloolua-nature-trail',
        title: 'Oloolua nature trail',
        image: olooluaNatureTrail,
        tag: 'Uburu Village',
        price: 4000,
        currency: 'KES',
        priceLabel: 'KES 4,000 each',
        description: 'Group bookings: min 5 people. Escape into lush forests, scenic waterfalls, and natural caves.',
        location: 'Oloolua Nature Trail, Karen, Nairobi',
        datesText: 'All year',
        availableDates: [],
        host: 'Uburu Village',
        minPeople: 5,
        ticketName: 'Group Pass (Min 5 People)',
        ticketNote: 'Group bookings: minimum 5 participants required',
        highlights: [
            '2-hour guided forest hike & cave exploration',
            'Waterfall views & bamboo garden relaxation',
            'Mindfulness & team wellness exercises',
            'Group package discount',
        ],
        isActive: true,
        isFeatured: true,
        optionId: 'oloolua-nature-trail-group',
    },
    {
        id: 'kids-outdoor-adventure',
        title: 'Kids Outdoor & Wellness Adventure',
        image: kidsImage,
        tag: 'Uburu Village',
        price: 3500,
        currency: 'KES',
        priceLabel: 'KES 3,500 each',
        description: 'Outdoor fun, arts & mindfulness for children. Safe, engaging, and deeply therapeutic.',
        location: 'Kiambu Paradise lost',
        datesText: 'All year',
        availableDates: [],
        host: 'Uburu Village',
        minPeople: 1,
        ticketName: 'Kids Adventure Ticket',
        ticketNote: 'Includes guided outdoor activities, art workshops & snacks',
        highlights: [
            'Guided nature walk & outdoor team games',
            'Creative arts, painting & glass craft sessions',
            'Mindfulness & emotional wellness activities for kids',
            'Healthy snacks & refreshments included',
            "Direct support to Uburu Village children's shelter",
        ],
        isActive: true,
        isFeatured: true,
        optionId: 'kids-outdoor-adventure-resident',
    },
    {
        id: 'therapeutic-trip',
        title: 'Therapeutic trip to (glassdoor Kitengela)',
        image: glassdoor2Image,
        tag: 'Uburu Village',
        price: 4500,
        currency: 'KES',
        priceLabel: 'KES 4,500 each',
        description: 'An inspiring and restorative therapeutic journey across breathtaking suspension bridges and mosaic art.',
        location: 'Kitengela Glass, on the edge of Nairobi National Park near Ongata Rongai',
        datesText: 'All year',
        availableDates: [],
        host: 'Uburu Village',
        minPeople: 1,
        ticketName: 'Resident Ticket (Kitengela Excursion)',
        ticketNote: 'Includes transport guidance, glass-blowing tour & therapeutic group session',
        highlights: [
            'Guided tour of Anselm Hot Glass studios & mosaic galleries',
            'Thrilling walk across the Kitengela suspension bridge',
            'Therapeutic group reflection & outdoor wellness activities',
            'Networking & community bonding surrounded by nature',
            "Direct support to Uburu Village's social impact projects",
        ],
        isActive: true,
        isFeatured: true,
        optionId: 'therapeutic-trip-resident',
    },
    {
        id: 'paradise-lost',
        title: 'Paradise Lost excursion',
        image: paradiseLostImage,
        tag: 'Uburu Village',
        price: 3500,
        currency: 'KES',
        priceLabel: 'KES 3,500 each',
        description: 'Ancient caves, sparkling waterfalls, boating, and refreshing nature walks.',
        location: 'Paradise Lost Resort, Kiambu Road, Kiambu',
        datesText: 'All year',
        availableDates: [],
        host: 'Uburu Village',
        minPeople: 1,
        ticketName: 'Resident Excursion Ticket',
        ticketNote: 'Covers park entry, cave tour, boat ride & group activities',
        highlights: [
            'Prehistoric Stone Age cave tour',
            'Boating on the peaceful lake & waterfall views',
            'Coffee farm walk & outdoor team bonding',
            'Therapeutic group wellness session',
        ],
        isActive: true,
        isFeatured: true,
        optionId: 'paradise-lost-resident',
    },
    {
        id: 'kids-kitengela-glass',
        title: 'Kids Kitengela Glass Adventure',
        image: kitengelaGlassImage,
        tag: 'Uburu Village',
        price: 4500,
        currency: 'KES',
        priceLabel: 'KES 4,500 each',
        description: 'Glass art, suspension bridge & mindfulness tailored especially for children.',
        location: 'Kitengela Glass, on the edge of Nairobi National Park near Ongata Rongai',
        datesText: 'All year',
        availableDates: [],
        host: 'Uburu Village',
        minPeople: 1,
        ticketName: 'Kids Kitengela Ticket',
        ticketNote: 'Includes guided glass tour, suspension bridge walk, art workshop & snacks',
        highlights: [
            'Guided tour of Anselm Hot Glass studios & mosaic art',
            'Exciting suspension bridge walk & outdoor nature explore',
            'Creative workshops and healthy snacks',
        ],
        isActive: true,
        isFeatured: true,
        optionId: 'kids-kitengela-glass-resident',
    },
    {
        id: 'maasai-mara',
        title: 'Maasai Mara Migration Season',
        image: maaImage,
        tag: 'Safari & Cultural',
        price: 27500,
        currency: 'KES',
        priceLabel: 'From KES 27,500',
        description: 'Witness the Eighth Wonder of the World! Legendary Great Wildebeest Migration, camp stays, and game drives.',
        location: 'Maasai Mara National Reserve, Kenya',
        datesText: 'July - October',
        availableDates: [],
        host: 'Uburu Village',
        minPeople: 1,
        ticketName: 'Migration Tour Pass',
        ticketNote: 'Covers transport, tented camp stay, park fees & game drives',
        highlights: [
            'Great Wildebeest Migration river crossing views',
            'Full day game drives in Maasai Mara National Reserve',
            'Comfortable tented camp accommodation & meals',
            'Professional safari guide & transport',
        ],
        isActive: true,
        isFeatured: true,
        optionId: 'maasai-mara-daily-group-departures-2026',
    },
];

/**
 * Loads stored village events or initializes with defaults.
 */
export const getStoredVillageEvents = (): VillageEvent[] => {
    if (typeof window === 'undefined') return INITIAL_VILLAGE_EVENTS;
    try {
        const raw = localStorage.getItem(VILLAGE_EVENTS_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(VILLAGE_EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_VILLAGE_EVENTS));
            return INITIAL_VILLAGE_EVENTS;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
    } catch (e) {
        console.error('Failed to parse village events from storage:', e);
    }
    return INITIAL_VILLAGE_EVENTS;
};

/**
 * Saves village events to localStorage and notifies listeners, then syncs to server.
 */
export const saveVillageEvents = (events: VillageEvent[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(VILLAGE_EVENTS_STORAGE_KEY, JSON.stringify(events));
        window.dispatchEvent(new CustomEvent(VILLAGE_EVENTS_EVENT, { detail: events }));

        // Asynchronously persist to server backend API
        fetch('/api/village/events.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events }),
        }).catch((err) => console.warn('Could not sync village events to server:', err));
    } catch (e) {
        console.error('Failed to save village events:', e);
    }
};

/**
 * Adds a new village event.
 */
export const addVillageEvent = (
    eventData: Omit<VillageEvent, 'id'> & { id?: string }
): { success: boolean; event: VillageEvent } => {
    const events = getStoredVillageEvents();
    
    // Generate slug from title if id not provided
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

    const fullEvent: VillageEvent = {
        ...eventData,
        id: slug,
        currency: eventData.currency || 'KES',
        priceLabel: eventData.priceLabel || `${eventData.currency || 'KES'} ${Number(eventData.price).toLocaleString()} each`,
        minPeople: eventData.minPeople !== undefined ? Math.max(1, Number(eventData.minPeople)) : 1,
        ticketName: eventData.ticketName || `${eventData.title} Pass`,
        ticketNote: eventData.ticketNote || 'Includes event access & support for Uburu Village',
        highlights: eventData.highlights && eventData.highlights.length > 0 ? eventData.highlights : ['Exclusive experience hosted by Uburu Village'],
        isActive: eventData.isActive !== undefined ? eventData.isActive : true,
        isFeatured: eventData.isFeatured !== undefined ? eventData.isFeatured : true,
        createdAt: Date.now(),
        optionId: eventData.optionId || `${slug}-ticket`,
    };

    const updated = [fullEvent, ...events];
    saveVillageEvents(updated);
    return { success: true, event: fullEvent };
};

/**
 * Updates an existing event.
 */
export const updateVillageEvent = (
    eventId: string,
    updates: Partial<VillageEvent>
): boolean => {
    const events = getStoredVillageEvents();
    const index = events.findIndex((e) => e.id === eventId);
    if (index === -1) return false;

    const current = events[index];
    const updatedPrice = updates.price !== undefined ? updates.price : current.price;
    const updatedCurrency = updates.currency || current.currency;
    const defaultLabel = `${updatedCurrency} ${Number(updatedPrice).toLocaleString()} each`;

    events[index] = {
        ...current,
        ...updates,
        priceLabel: updates.priceLabel || (updates.price !== undefined ? defaultLabel : current.priceLabel),
    };

    saveVillageEvents(events);
    return true;
};

/**
 * Deletes an event by ID.
 */
export const deleteVillageEvent = (eventId: string): boolean => {
    const events = getStoredVillageEvents();
    const filtered = events.filter((e) => e.id !== eventId);
    if (filtered.length === events.length) return false;

    saveVillageEvents(filtered);
    return true;
};

/**
 * Resets events to initial defaults.
 */
export const resetVillageEventsToDefault = (): VillageEvent[] => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(VILLAGE_EVENTS_STORAGE_KEY);
        localStorage.setItem(VILLAGE_EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_VILLAGE_EVENTS));
        window.dispatchEvent(new CustomEvent(VILLAGE_EVENTS_EVENT, { detail: INITIAL_VILLAGE_EVENTS }));

        fetch('/api/village/events.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: INITIAL_VILLAGE_EVENTS }),
        }).catch(() => {});
    }
    return INITIAL_VILLAGE_EVENTS;
};

/**
 * Fetches the latest live village events from the server.
 */
export const syncVillageEventsFromDatabase = async (): Promise<VillageEvent[]> => {
    try {
        const res = await fetch('/api/village/events.php');
        if (res.ok) {
            const data = await res.json();
            if (data && data.success && Array.isArray(data.events) && data.events.length > 0) {
                localStorage.setItem(VILLAGE_EVENTS_STORAGE_KEY, JSON.stringify(data.events));
                window.dispatchEvent(new CustomEvent(VILLAGE_EVENTS_EVENT, { detail: data.events }));
                return data.events;
            }
        }
    } catch {
        // Graceful fallback to local cache
    }
    return getStoredVillageEvents();
};

/**
 * Formats stored village events into VillageEventOption[] for cart & checkout integration.
 */
export const getStorefrontVillageEventOptions = (): VillageEventOption[] => {
    const events = getStoredVillageEvents().filter((e) => e.isActive);
    return events.map((event) => ({
        id: event.optionId || `${event.id}-ticket`,
        packageId: event.id,
        campId: event.id,
        campName: event.title,
        residencyType: 'resident',
        mealPlanLabel: event.datesText || 'All year',
        availableMonths: ['july', 'august', 'september', 'october'],
        name: event.title,
        price: event.price,
        currency: event.currency,
        tag: event.tag || 'Uburu Village',
        image: event.image,
    }));
};

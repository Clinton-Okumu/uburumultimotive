export interface TherapyServiceConfig {
    id: string;
    title: string;
    serviceType: string;
    badge: string;
    description: string;
    iconName: 'MessageSquare' | 'Rocket' | 'Stethoscope' | 'Brain' | 'HeartPulse';
    enabled: boolean;
    headerBg?: string;
    buttonText?: string;
    order: number;
}

export interface TherapyPricingPlan {
    id: string;
    category: 'Individual' | 'Couples' | 'Group' | 'Coaching' | 'Medical';
    mode: 'Online' | 'Physical' | 'Both';
    title: string;
    sessions: number;
    amountKes: number;
    amountUsd?: number;
    description?: string;
    features: string[];
    isPopular?: boolean;
    isActive: boolean;
}

export const THERAPY_SERVICES_STORAGE_KEY = 'uburu_admin_therapy_services_v1';
export const THERAPY_PRICING_STORAGE_KEY = 'uburu_admin_therapy_pricing_v1';
export const THERAPY_CONFIG_EVENT = 'uburu_therapy_config_updated';

export const INITIAL_THERAPY_SERVICES: TherapyServiceConfig[] = [
    {
        id: 'therapy',
        title: 'Therapy',
        serviceType: 'Individual Therapy (For Myself)',
        badge: 'Mental Wellbeing',
        description: 'Professional counseling for individuals, couples, and families to support emotional well-being.',
        iconName: 'MessageSquare',
        enabled: true,
        headerBg: 'bg-yellow-50/90',
        buttonText: 'Book Now',
        order: 1,
    },
    {
        id: 'coaching',
        title: 'Life Coaching',
        serviceType: 'Life Coaching',
        badge: 'Personal Growth',
        description: 'Personalized guidance to help you set and achieve life goals and maximize your potential.',
        iconName: 'Rocket',
        enabled: true,
        headerBg: 'bg-neutral-900',
        buttonText: 'Book Now',
        order: 2,
    },
    {
        id: 'medical',
        title: 'Medical Consultation',
        serviceType: 'Medical Consultation',
        badge: 'Holistic Health',
        description: 'Expert medical advice and consultation services to support your holistic health and wellbeing.',
        iconName: 'Stethoscope',
        enabled: true,
        headerBg: 'bg-amber-100/60',
        buttonText: 'Book Now',
        order: 3,
    },
];

export const INITIAL_THERAPY_PRICING: TherapyPricingPlan[] = [
    {
        id: 'ind-online-single',
        category: 'Individual',
        mode: 'Online',
        title: 'Online Individual Session',
        sessions: 1,
        amountKes: 1600,
        amountUsd: 30,
        description: 'Single online video or audio consultation with licensed psychologist.',
        features: ['50-minute virtual session', 'Confidential video room', 'Actionable mental health tools', '24h rescheduling notice'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'ind-online-4pack',
        category: 'Individual',
        mode: 'Online',
        title: 'Online 4-Session Growth Pack',
        sessions: 4,
        amountKes: 5000,
        amountUsd: 110,
        description: 'Structured progress plan across 4 weeks with therapist assignment.',
        features: ['4x 50-minute sessions', 'Direct therapist messaging support', 'Personalized reflection journal', 'Progress evaluation milestone'],
        isPopular: true,
        isActive: true,
    },
    {
        id: 'ind-physical-single',
        category: 'Individual',
        mode: 'Physical',
        title: 'In-Person Individual Therapy',
        sessions: 1,
        amountKes: 1800,
        amountUsd: 35,
        description: 'Face-to-face in-clinic therapy at our quiet consultation suites.',
        features: ['Private clinic atmosphere', 'Comprehensive diagnostic intake', 'Tea/beverage reception', 'Secure treatment records'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'ind-physical-4pack',
        category: 'Individual',
        mode: 'Physical',
        title: 'In-Person 4-Session Bundle',
        sessions: 4,
        amountKes: 6500,
        amountUsd: 140,
        description: 'Our most sought-after four-week transformative in-person package.',
        features: ['4x in-clinic sessions', 'Consistent dedicated counselor', 'Self-care worksheet toolkit', 'Priority session scheduling'],
        isPopular: true,
        isActive: true,
    },
    {
        id: 'couples-single',
        category: 'Couples',
        mode: 'Both',
        title: 'Couples Counseling Session',
        sessions: 1,
        amountKes: 3000,
        amountUsd: 65,
        description: 'Joint relationship and communication counseling for partners.',
        features: ['75-minute dual counselor session', 'Relationship dynamics assessment', 'Conflict de-escalation strategies', 'Online or physical available'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'group-per-person',
        category: 'Group',
        mode: 'Physical',
        title: 'Support Group Circle',
        sessions: 1,
        amountKes: 1500,
        amountUsd: 25,
        description: 'Facilitated healing circles with peers navigating similar journeys.',
        features: ['90-minute group circle', 'Certified group facilitator', 'Safe, non-judgmental space', 'Interactive community healing'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'coaching-session',
        category: 'Coaching',
        mode: 'Both',
        title: 'Life & Career Coaching',
        sessions: 1,
        amountKes: 2500,
        amountUsd: 50,
        description: 'Executive guidance, habit building, and personal mastery alignment.',
        features: ['Goal clarification blueprint', 'Action-oriented weekly accountability', 'Mindset breakthrough framework', 'Direct coach feedback'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'medical-consultation',
        category: 'Medical',
        mode: 'Both',
        title: 'Holistic Medical Consultation',
        sessions: 1,
        amountKes: 2000,
        amountUsd: 40,
        description: 'Certified medical practitioner assessment and wellness prescription.',
        features: ['Holistic health assessment', 'Prescription & lab referrals', 'Preventive care strategy', 'Follow-up consultation review'],
        isPopular: false,
        isActive: true,
    },
];

/**
 * Loads stored therapy services or defaults
 */
export const getStoredTherapyServices = (): TherapyServiceConfig[] => {
    if (typeof window === 'undefined') return INITIAL_THERAPY_SERVICES;
    try {
        const raw = localStorage.getItem(THERAPY_SERVICES_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(THERAPY_SERVICES_STORAGE_KEY, JSON.stringify(INITIAL_THERAPY_SERVICES));
            return INITIAL_THERAPY_SERVICES;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
        console.error('Failed to parse therapy services:', e);
    }
    return INITIAL_THERAPY_SERVICES;
};

export const saveTherapyServices = (services: TherapyServiceConfig[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(THERAPY_SERVICES_STORAGE_KEY, JSON.stringify(services));
        window.dispatchEvent(new CustomEvent(THERAPY_CONFIG_EVENT, { detail: { services } }));
    } catch (e) {
        console.error('Failed to save therapy services:', e);
    }
};

/**
 * Loads stored therapy pricing or defaults
 */
export const getStoredTherapyPricing = (): TherapyPricingPlan[] => {
    if (typeof window === 'undefined') return INITIAL_THERAPY_PRICING;
    try {
        const raw = localStorage.getItem(THERAPY_PRICING_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(THERAPY_PRICING_STORAGE_KEY, JSON.stringify(INITIAL_THERAPY_PRICING));
            return INITIAL_THERAPY_PRICING;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
        console.error('Failed to parse therapy pricing:', e);
    }
    return INITIAL_THERAPY_PRICING;
};

export const saveTherapyPricing = (pricing: TherapyPricingPlan[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(THERAPY_PRICING_STORAGE_KEY, JSON.stringify(pricing));
        window.dispatchEvent(new CustomEvent(THERAPY_CONFIG_EVENT, { detail: { pricing } }));
    } catch (e) {
        console.error('Failed to save therapy pricing:', e);
    }
};

/**
 * Updates a specific therapy service pathway (e.g. Therapy, Life Coaching, Medical)
 */
export const updateTherapyService = (id: string, updates: Partial<TherapyServiceConfig>): boolean => {
    const services = getStoredTherapyServices();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return false;
    services[index] = { ...services[index], ...updates };
    saveTherapyServices(services);
    return true;
};

/**
 * Creates or updates a pricing plan
 */
export const savePricingPlan = (plan: TherapyPricingPlan): void => {
    const plans = getStoredTherapyPricing();
    const index = plans.findIndex((p) => p.id === plan.id);
    if (index >= 0) {
        plans[index] = plan;
    } else {
        plans.push(plan);
    }
    saveTherapyPricing(plans);
};

/**
 * Deletes a pricing plan
 */
export const deletePricingPlan = (planId: string): boolean => {
    const plans = getStoredTherapyPricing();
    const filtered = plans.filter((p) => p.id !== planId);
    if (filtered.length === plans.length) return false;
    saveTherapyPricing(filtered);
    return true;
};

/**
 * Reset all therapy data to defaults
 */
export const resetTherapyToDefault = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(THERAPY_SERVICES_STORAGE_KEY, JSON.stringify(INITIAL_THERAPY_SERVICES));
        localStorage.setItem(THERAPY_PRICING_STORAGE_KEY, JSON.stringify(INITIAL_THERAPY_PRICING));
        window.dispatchEvent(
            new CustomEvent(THERAPY_CONFIG_EVENT, {
                detail: { services: INITIAL_THERAPY_SERVICES, pricing: INITIAL_THERAPY_PRICING },
            })
        );
    }
};

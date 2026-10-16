import { getAdminAuthHeader } from '../auth/AdminAuthContext';

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

export type FormTherapyPricingOption = {
    id: string;
    category: 'Individual' | 'Couples' | 'Group';
    mode: 'Online' | 'Physical';
    sessions: number;
    amount: number;
    currency: 'KES' | 'USD';
    label: string;
};

export type FormCoachingPricingPackage = {
    id: string;
    sessions: number;
    amount: number;
    currency: 'KES' | 'USD';
    mode: 'Online' | 'Physical';
    label: string;
};

export type FormMedicalPricingPackage = {
    id: string;
    sessions: number;
    amount: number;
    currency: 'KES' | 'USD';
    mode: 'Online' | 'Physical';
    label: string;
};

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
    // INDIVIDUAL - ONLINE
    {
        id: 'ind-online-1',
        category: 'Individual',
        mode: 'Online',
        title: 'Online Individual (1 Session)',
        sessions: 1,
        amountKes: 1600,
        amountUsd: 25,
        description: 'Single online video or audio consultation with a licensed psychologist.',
        features: ['50-minute virtual session', 'Confidential video room', 'Actionable mental health tools', '24h rescheduling notice'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'ind-online-4',
        category: 'Individual',
        mode: 'Online',
        title: 'Online Individual (4 Sessions)',
        sessions: 4,
        amountKes: 5000,
        amountUsd: 65,
        description: 'Structured progress plan across 4 weeks with therapist assignment.',
        features: ['4x 50-minute sessions', 'Direct therapist messaging support', 'Personalized reflection journal', 'Progress evaluation milestone'],
        isPopular: true,
        isActive: true,
    },
    {
        id: 'ind-online-6',
        category: 'Individual',
        mode: 'Online',
        title: 'Online Individual (6 Sessions)',
        sessions: 6,
        amountKes: 7500,
        amountUsd: 85,
        description: 'Deep transformative therapy for burnout, stress, and anxiety relief.',
        features: ['6x 50-minute sessions', 'Ongoing homework check-ins', 'Therapeutic goal assessment', 'Emergency hotline access'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'ind-online-8',
        category: 'Individual',
        mode: 'Online',
        title: 'Online Individual (8 Sessions)',
        sessions: 8,
        amountKes: 10000,
        amountUsd: 120,
        description: 'Comprehensive 2-month mental health transformation.',
        features: ['8x 50-minute sessions', 'Full psychological toolkit', 'Direct messaging', 'Certificate of completion if needed'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'ind-online-10',
        category: 'Individual',
        mode: 'Online',
        title: 'Online Individual (10 Sessions)',
        sessions: 10,
        amountKes: 13000,
        amountUsd: 150,
        description: 'Long-term healing journey for complex trauma, life shifts, and personal mastery.',
        features: ['10x 50-minute sessions', 'Deep dive clinical care', 'Priority booking calendar', 'Personalized healing roadmap'],
        isPopular: false,
        isActive: true,
    },

    // INDIVIDUAL - PHYSICAL
    {
        id: 'ind-physical-1',
        category: 'Individual',
        mode: 'Physical',
        title: 'Physical Individual (1 Session)',
        sessions: 1,
        amountKes: 1800,
        amountUsd: 35,
        description: 'Face-to-face in-clinic therapy at our quiet consultation suites.',
        features: ['Private clinic atmosphere', 'Comprehensive diagnostic intake', 'Tea/beverage reception', 'Secure treatment records'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'ind-physical-4',
        category: 'Individual',
        mode: 'Physical',
        title: 'Physical Individual (4 Sessions)',
        sessions: 4,
        amountKes: 6500,
        amountUsd: 140,
        description: 'Four-week transformative in-person package.',
        features: ['4x in-clinic sessions', 'Consistent dedicated counselor', 'Self-care worksheet toolkit', 'Priority session scheduling'],
        isPopular: true,
        isActive: true,
    },
    {
        id: 'ind-physical-6',
        category: 'Individual',
        mode: 'Physical',
        title: 'Physical Individual (6 Sessions)',
        sessions: 6,
        amountKes: 10000,
        amountUsd: 200,
        description: 'Six in-clinic sessions for sustained emotional breakthrough.',
        features: ['6x in-clinic sessions', 'Deep therapeutic support', 'Personal growth assignments', 'Progress milestone review'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'ind-physical-8',
        category: 'Individual',
        mode: 'Physical',
        title: 'Physical Individual (8 Sessions)',
        sessions: 8,
        amountKes: 12000,
        amountUsd: 250,
        description: 'Eight in-clinic sessions for comprehensive healing.',
        features: ['8x in-clinic sessions', 'Dedicated senior therapist', 'Holistic check-ins', 'Priority scheduling'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'ind-physical-10',
        category: 'Individual',
        mode: 'Physical',
        title: 'Physical Individual (10 Sessions)',
        sessions: 10,
        amountKes: 18000,
        amountUsd: 350,
        description: 'Ten in-clinic sessions for full behavioral & emotional realignment.',
        features: ['10x in-clinic sessions', 'Comprehensive treatment plan', 'Private executive suite', 'Continuous guidance'],
        isPopular: false,
        isActive: true,
    },

    // COUPLES
    {
        id: 'couples-online-1',
        category: 'Couples',
        mode: 'Online',
        title: 'Couples Online (1 Session)',
        sessions: 1,
        amountKes: 3000,
        amountUsd: 40,
        description: 'Virtual relationship counseling for couples.',
        features: ['75-minute virtual session', 'Communication breakdown analysis', 'Conflict resolution framework', 'Both partners join remotely'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'couples-online-4',
        category: 'Couples',
        mode: 'Online',
        title: 'Couples Online (4 Sessions)',
        sessions: 4,
        amountKes: 10000,
        amountUsd: 140,
        description: 'Four online couples sessions for structured relationship rebuild.',
        features: ['4x 75-minute virtual sessions', 'Couple communication workbook', 'Direct messaging check-ins', 'Joint goal milestones'],
        isPopular: true,
        isActive: true,
    },
    {
        id: 'couples-physical-1',
        category: 'Couples',
        mode: 'Physical',
        title: 'Couples In-Person (1 Session)',
        sessions: 1,
        amountKes: 3500,
        amountUsd: 50,
        description: 'Face-to-face counseling for partners in our comfortable suites.',
        features: ['75-minute in-person session', 'Neutral, confidential setting', 'Active listening exercises', 'Take-home connection exercises'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'couples-physical-4',
        category: 'Couples',
        mode: 'Physical',
        title: 'Couples In-Person (4 Sessions)',
        sessions: 4,
        amountKes: 12000,
        amountUsd: 180,
        description: 'Four intensive in-person sessions to resolve deep conflicts.',
        features: ['4x 75-minute in-clinic sessions', 'Couples attachment diagnostic', 'Weekly mediation tasks', 'Dedicated couples specialist'],
        isPopular: true,
        isActive: true,
    },

    // GROUP
    {
        id: 'group-per-person',
        category: 'Group',
        mode: 'Physical',
        title: 'Support Group Circle (Per Person)',
        sessions: 1,
        amountKes: 1500,
        amountUsd: 25,
        description: 'Facilitated healing circles with peers navigating similar journeys.',
        features: ['90-minute group circle', 'Certified group facilitator', 'Safe, non-judgmental space', 'Interactive community healing'],
        isPopular: false,
        isActive: true,
    },

    // LIFE COACHING
    {
        id: 'lc-online-1',
        category: 'Coaching',
        mode: 'Online',
        title: 'Life Coaching Online (1 Session)',
        sessions: 1,
        amountKes: 1600,
        amountUsd: 30,
        description: 'Goal clarification and mindset alignment.',
        features: ['50-minute coaching session', 'Action blueprint', 'Clarity questionnaire', 'Direct follow-up notes'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'lc-online-4',
        category: 'Coaching',
        mode: 'Online',
        title: 'Life Coaching Online (4 Sessions)',
        sessions: 4,
        amountKes: 5000,
        amountUsd: 100,
        description: 'Four-week goal acceleration coaching pack.',
        features: ['4x 50-minute coaching sessions', 'Weekly accountability checks', 'Habit tracker worksheet', 'Email/WhatsApp check-ins'],
        isPopular: true,
        isActive: true,
    },
    {
        id: 'lc-physical-1',
        category: 'Coaching',
        mode: 'Physical',
        title: 'Life Coaching In-Person (1 Session)',
        sessions: 1,
        amountKes: 1800,
        amountUsd: 35,
        description: 'Face-to-face life & career coaching consultation.',
        features: ['In-person strategy session', 'Executive alignment', 'Actionable goal mapping', 'Personalized reflection toolkit'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'lc-physical-4',
        category: 'Coaching',
        mode: 'Physical',
        title: 'Life Coaching In-Person (4 Sessions)',
        sessions: 4,
        amountKes: 6500,
        amountUsd: 130,
        description: 'Intensive 4-session in-person transformational program.',
        features: ['4x in-person sessions', 'Comprehensive personal development audit', 'Direct coach access', 'Milestone evaluation'],
        isPopular: true,
        isActive: true,
    },

    // MEDICAL CONSULTATION
    {
        id: 'med-online-1',
        category: 'Medical',
        mode: 'Online',
        title: 'Virtual Medical Consultation (1 Session)',
        sessions: 1,
        amountKes: 2500,
        amountUsd: 40,
        description: 'Virtual consultation with certified medical practitioner.',
        features: ['Comprehensive health assessment', 'Electronic prescriptions & lab requisitions', 'Preventive care strategy', 'Follow-up consultation review'],
        isPopular: false,
        isActive: true,
    },
    {
        id: 'med-physical-1',
        category: 'Medical',
        mode: 'Physical',
        title: 'In-Person Medical Consultation (1 Session)',
        sessions: 1,
        amountKes: 3500,
        amountUsd: 55,
        description: 'Comprehensive physical examination and specialist consultation.',
        features: ['Complete vital signs & clinical check', 'Specialist diagnosis', 'Prescriptions & test reviews', 'Diet & wellness guidance'],
        isPopular: true,
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

export const saveTherapyServices = async (services: TherapyServiceConfig[]): Promise<void> => {
    const res = await fetch('/api/therapy/config.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAdminAuthHeader(),
        },
        body: JSON.stringify({ services }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Failed to save therapy services (HTTP ${res.status})`);
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(THERAPY_SERVICES_STORAGE_KEY, JSON.stringify(services));
        window.dispatchEvent(new CustomEvent(THERAPY_CONFIG_EVENT, { detail: { services } }));
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

export const saveTherapyPricing = async (pricing: TherapyPricingPlan[]): Promise<void> => {
    const res = await fetch('/api/therapy/config.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAdminAuthHeader(),
        },
        body: JSON.stringify({ pricing }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Failed to save therapy pricing (HTTP ${res.status})`);
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(THERAPY_PRICING_STORAGE_KEY, JSON.stringify(pricing));
        window.dispatchEvent(new CustomEvent(THERAPY_CONFIG_EVENT, { detail: { pricing } }));
    }
};

/**
 * Syncs therapy services & pricing from backend API into localStorage and triggers re-renders.
 */
export const syncTherapyFromDatabase = async (): Promise<{ services: TherapyServiceConfig[]; pricing: TherapyPricingPlan[] }> => {
    try {
        const res = await fetch('/api/therapy/config.php');
        if (res.ok) {
            const data = await res.json();
            if (data && data.success) {
                if (Array.isArray(data.services) && data.services.length > 0) {
                    localStorage.setItem(THERAPY_SERVICES_STORAGE_KEY, JSON.stringify(data.services));
                }
                if (Array.isArray(data.pricing) && data.pricing.length > 0) {
                    localStorage.setItem(THERAPY_PRICING_STORAGE_KEY, JSON.stringify(data.pricing));
                }
                window.dispatchEvent(
                    new CustomEvent(THERAPY_CONFIG_EVENT, {
                        detail: { services: data.services, pricing: data.pricing },
                    })
                );
            }
        }
    } catch {
        // Fall back gracefully
    }
    return {
        services: getStoredTherapyServices(),
        pricing: getStoredTherapyPricing(),
    };
};

/**
 * Helper: Formats stored pricing plans into TherapyPricingOption[] for RequestFormSection
 */
export const getTherapyFormPricingOptions = (userCurrency: 'KES' | 'USD' = 'KES'): FormTherapyPricingOption[] => {
    const plans = getStoredTherapyPricing().filter((p) => p.isActive);
    const options: FormTherapyPricingOption[] = [];

    plans.forEach((plan) => {
        if (plan.category !== 'Individual' && plan.category !== 'Couples' && plan.category !== 'Group') return;

        const modes: ('Online' | 'Physical')[] =
            plan.mode === 'Both' ? ['Online', 'Physical'] : [plan.mode as 'Online' | 'Physical'];

        modes.forEach((m) => {
            const amount = userCurrency === 'USD' && plan.amountUsd ? plan.amountUsd : plan.amountKes;
            const formattedAmount = `${userCurrency} ${amount.toLocaleString()}`;
            options.push({
                id: `${plan.id}-${m.toLowerCase()}-${userCurrency.toLowerCase()}`,
                category: plan.category as 'Individual' | 'Couples' | 'Group',
                mode: m,
                sessions: plan.sessions,
                amount,
                currency: userCurrency,
                label: `${m} ${plan.category.toLowerCase()} - ${plan.sessions} ${plan.sessions === 1 ? 'session' : 'sessions'} (${formattedAmount})`,
            });
        });
    });

    return options;
};

/**
 * Helper: Formats stored pricing plans into CoachingPricingPackage[] for LifeCoachingFormSection
 */
export const getLifeCoachingPricingPackages = (userCurrency: 'KES' | 'USD' = 'KES'): FormCoachingPricingPackage[] => {
    const plans = getStoredTherapyPricing().filter((p) => p.isActive && p.category === 'Coaching');
    const packages: FormCoachingPricingPackage[] = [];

    plans.forEach((plan) => {
        const modes: ('Online' | 'Physical')[] =
            plan.mode === 'Both' ? ['Online', 'Physical'] : [plan.mode as 'Online' | 'Physical'];

        modes.forEach((m) => {
            const amount = userCurrency === 'USD' && plan.amountUsd ? plan.amountUsd : plan.amountKes;
            const formattedAmount = `${userCurrency} ${amount.toLocaleString()}`;
            packages.push({
                id: `${plan.id}-${m.toLowerCase()}-${userCurrency.toLowerCase()}`,
                sessions: plan.sessions,
                amount,
                currency: userCurrency,
                mode: m,
                label: `${plan.sessions} ${plan.sessions === 1 ? 'Session' : 'Sessions'} (${m}) - ${formattedAmount}`,
            });
        });
    });

    return packages;
};

/**
 * Helper: Formats stored pricing plans into MedicalPricingPackage[] for MedicalConsultationFormSection
 */
export const getMedicalPricingPackages = (userCurrency: 'KES' | 'USD' = 'KES'): FormMedicalPricingPackage[] => {
    const plans = getStoredTherapyPricing().filter((p) => p.isActive && p.category === 'Medical');
    const packages: FormMedicalPricingPackage[] = [];

    plans.forEach((plan) => {
        const modes: ('Online' | 'Physical')[] =
            plan.mode === 'Both' ? ['Online', 'Physical'] : [plan.mode as 'Online' | 'Physical'];

        modes.forEach((m) => {
            const amount = userCurrency === 'USD' && plan.amountUsd ? plan.amountUsd : plan.amountKes;
            const formattedAmount = `${userCurrency} ${amount.toLocaleString()}`;
            packages.push({
                id: `${plan.id}-${m.toLowerCase()}-${userCurrency.toLowerCase()}`,
                sessions: plan.sessions,
                amount,
                currency: userCurrency,
                mode: m,
                label: `${m === 'Online' ? 'Online' : 'Physical'} Medical Consultation (${plan.sessions} ${plan.sessions === 1 ? 'Session' : 'Sessions'}) - ${formattedAmount}`,
            });
        });
    });

    return packages;
};

/**
 * Updates a specific therapy service pathway (e.g. Therapy, Life Coaching, Medical)
 */
export const updateTherapyService = async (id: string, updates: Partial<TherapyServiceConfig>): Promise<boolean> => {
    const services = getStoredTherapyServices();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return false;
    services[index] = { ...services[index], ...updates };
    await saveTherapyServices(services);
    return true;
};

/**
 * Creates or updates a pricing plan
 */
export const savePricingPlan = async (plan: TherapyPricingPlan): Promise<void> => {
    const plans = getStoredTherapyPricing();
    const index = plans.findIndex((p) => p.id === plan.id);
    if (index >= 0) {
        plans[index] = plan;
    } else {
        plans.push(plan);
    }
    await saveTherapyPricing(plans);
};

/**
 * Deletes a pricing plan
 */
export const deletePricingPlan = async (planId: string): Promise<boolean> => {
    const plans = getStoredTherapyPricing();
    const filtered = plans.filter((p) => p.id !== planId);
    if (filtered.length === plans.length) return false;
    await saveTherapyPricing(filtered);
    return true;
};

/**
 * Reset all therapy data to defaults
 */
export const resetTherapyToDefault = async (): Promise<void> => {
    const res = await fetch('/api/therapy/config.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAdminAuthHeader(),
        },
        body: JSON.stringify({ services: INITIAL_THERAPY_SERVICES, pricing: INITIAL_THERAPY_PRICING }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Failed to reset therapy configuration (HTTP ${res.status})`);
    }

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

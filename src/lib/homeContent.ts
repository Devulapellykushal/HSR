'use client';

export const HOME_CONTENT_STORAGE_KEY = 'hsr_home_content';
export const HOME_CONTENT_EVENT = 'hsr-home-content-updated';

type ValueLabel = {
  value: string;
  label: string;
};

export type HeroContent = {
  mainTitle: string;
  subtitle: string;
  backgroundImage: string;
  ctaButtonText: string;
  // Optional page-specific overrides
  projectsImage?: string;
  aboutImage?: string;
  contactImage?: string;
};

export type StatsContent = {
  experience: ValueLabel;
  projects: ValueLabel;
  families: ValueLabel;
  sqft: ValueLabel;
};

export type FooterContent = {
  officeAddress: string;
  phoneNumber: string;
  emailAddress: string;
  whatsappNumber: string;
};

export type HomeContent = {
  hero: HeroContent;
  stats: StatsContent;
  footer: FooterContent;
};

export type PartialHomeContent = Partial<{
  hero: Partial<HeroContent>;
  stats: Partial<{
    experience: Partial<ValueLabel>;
    projects: Partial<ValueLabel>;
    families: Partial<ValueLabel>;
    sqft: Partial<ValueLabel>;
  }>;
  footer: Partial<FooterContent>;
}>;

export const defaultHomeContent: HomeContent = {
  hero: {
    mainTitle: 'Premium Living Spaces in Karimnagar',
    subtitle: 'Discover your dream home with HSR Green Homes - where quality meets comfort.',
    backgroundImage: '',
    ctaButtonText: 'Explore Projects',
    projectsImage: '',
    aboutImage: '',
    contactImage: '',
  },
  stats: {
    experience: { value: '15+', label: 'Years of Excellence' },
    projects: { value: '50+', label: 'Projects Completed' },
    families: { value: '2000+', label: 'Happy Families' },
    sqft: { value: '10L+', label: 'Sq.Ft Delivered' },
  },
  footer: {
    officeAddress: 'HSR Green Homes, Karimnagar, Telangana 505001',
    phoneNumber: '+91 9876543210',
    emailAddress: 'info@hsrgreenhomes.com',
    whatsappNumber: '+91 9876543210',
  },
};

const mergeValueLabel = (base: ValueLabel, override?: Partial<ValueLabel>): ValueLabel => ({
  value: override?.value ?? base.value,
  label: override?.label ?? base.label,
});

const mergeHomeContent = (
  base: HomeContent,
  overrides?: PartialHomeContent,
): HomeContent => ({
  hero: {
    mainTitle: overrides?.hero?.mainTitle ?? base.hero.mainTitle,
    subtitle: overrides?.hero?.subtitle ?? base.hero.subtitle,
    backgroundImage: overrides?.hero?.backgroundImage ?? base.hero.backgroundImage,
    ctaButtonText: overrides?.hero?.ctaButtonText ?? base.hero.ctaButtonText,
    projectsImage: overrides?.hero?.projectsImage ?? base.hero.projectsImage,
    aboutImage: overrides?.hero?.aboutImage ?? base.hero.aboutImage,
    contactImage: overrides?.hero?.contactImage ?? base.hero.contactImage,
  },
  stats: {
    experience: mergeValueLabel(base.stats.experience, overrides?.stats?.experience),
    projects: mergeValueLabel(base.stats.projects, overrides?.stats?.projects),
    families: mergeValueLabel(base.stats.families, overrides?.stats?.families),
    sqft: mergeValueLabel(base.stats.sqft, overrides?.stats?.sqft),
  },
  footer: {
    officeAddress: overrides?.footer?.officeAddress ?? base.footer.officeAddress,
    phoneNumber: overrides?.footer?.phoneNumber ?? base.footer.phoneNumber,
    emailAddress: overrides?.footer?.emailAddress ?? base.footer.emailAddress,
    whatsappNumber: overrides?.footer?.whatsappNumber ?? base.footer.whatsappNumber,
  },
});

export const getHomeContent = (): HomeContent => {
  if (typeof window === 'undefined') {
    return defaultHomeContent;
  }

  try {
    const stored = localStorage.getItem(HOME_CONTENT_STORAGE_KEY);
    if (!stored) {
      return defaultHomeContent;
    }
    const parsed = JSON.parse(stored);
    return mergeHomeContent(defaultHomeContent, parsed);
  } catch {
    return defaultHomeContent;
  }
};

export const saveHomeContent = (updates: PartialHomeContent): HomeContent => {
  if (typeof window === 'undefined') {
    return defaultHomeContent;
  }

  const current = getHomeContent();
  const merged = mergeHomeContent(current, updates);
  localStorage.setItem(HOME_CONTENT_STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event(HOME_CONTENT_EVENT));
  return merged;
};

export const subscribeToHomeContent = (callback: (content: HomeContent) => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const customHandler = () => callback(getHomeContent());
  const storageHandler = (event: StorageEvent) => {
    if (event.key === HOME_CONTENT_STORAGE_KEY) {
      callback(getHomeContent());
    }
  };

  window.addEventListener(HOME_CONTENT_EVENT, customHandler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(HOME_CONTENT_EVENT, customHandler);
    window.removeEventListener('storage', storageHandler);
  };
};


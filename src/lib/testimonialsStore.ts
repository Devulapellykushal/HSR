'use client';

const TESTIMONIALS_STORAGE_KEY = 'adminTestimonials';
const TESTIMONIALS_EVENT = 'hsr-testimonials-updated';

export type TestimonialRecord = {
  id: number;
  name: string;
  project?: string;
  text: string;
  avatar?: string;
};

const defaultTestimonials: TestimonialRecord[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    project: 'Green Valley Phase 1',
    text: 'HSR Green Homes delivered exactly what they promised. The quality of construction and attention to detail is exceptional.',
    avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=28A745&color=fff',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    project: 'Emerald Heights',
    text: 'Moving into Emerald Heights was the best decision we made. The amenities and location are perfect for our family.',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=28A745&color=fff',
  },
  {
    id: 3,
    name: 'Amit Patel',
    project: 'Garden View Apartments',
    text: 'The team at HSR Green Homes was professional throughout the entire process. Highly recommended!',
    avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=28A745&color=fff',
  },
];

export const getDefaultTestimonials = () => defaultTestimonials;

const readStoredTestimonials = (): TestimonialRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(TESTIMONIALS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeStoredTestimonials = (testimonials: TestimonialRecord[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(testimonials));
  emitTestimonialsUpdate();
};

export const getTestimonials = (): TestimonialRecord[] => {
  if (typeof window === 'undefined') {
    return defaultTestimonials;
  }

  const stored = readStoredTestimonials();
  if (!stored.length) {
    return defaultTestimonials;
  }

  return stored;
};

export const upsertTestimonial = (testimonial: TestimonialRecord) => {
  const stored = readStoredTestimonials();
  const existingIndex = stored.findIndex((item) => item.id === testimonial.id);
  if (existingIndex >= 0) {
    stored[existingIndex] = { ...stored[existingIndex], ...testimonial };
  } else {
    stored.unshift(testimonial);
  }
  writeStoredTestimonials(stored);
};

export const deleteTestimonial = (id: number) => {
  const stored = readStoredTestimonials();
  const filtered = stored.filter((item) => item.id !== id);
  writeStoredTestimonials(filtered);
};

export const emitTestimonialsUpdate = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(TESTIMONIALS_EVENT));
};

export const subscribeToTestimonials = (callback: (testimonials: TestimonialRecord[]) => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = () => callback(getTestimonials());
  window.addEventListener(TESTIMONIALS_EVENT, handler);
  const storageHandler = (event: StorageEvent) => {
    if (event.key === TESTIMONIALS_STORAGE_KEY) {
      handler();
    }
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(TESTIMONIALS_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
};


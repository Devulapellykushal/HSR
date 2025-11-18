'use client';

import { useEffect, useState } from 'react';
import { getDefaultTestimonials, getTestimonials, subscribeToTestimonials, TestimonialRecord } from '@/lib/testimonialsStore';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>(getDefaultTestimonials());

  useEffect(() => {
    setTestimonials(getTestimonials());
    const unsubscribe = subscribeToTestimonials((next) => setTestimonials(next));
    return unsubscribe;
  }, []);

  return testimonials;
}


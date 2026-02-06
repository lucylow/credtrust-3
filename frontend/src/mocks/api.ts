// Mock API functions for CredTrust
import mockData from './mockData';
import type { Slide } from '@/types/slides.types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchSlides(): Promise<{ count: number; results: Slide[] }> {
  await delay(300);
  return {
    count: mockData.slides.length,
    results: mockData.slides,
  };
}

export async function fetchSlideBySlug(slug: string): Promise<Slide | null> {
  await delay(200);
  const slide = mockData.slides.find(s => s.slug === slug);
  return slide || null;
}

export async function fetchLogo() {
  await delay(100);
  return mockData.slides[0].crest;
}

// Export mock data for direct access
export { mockData };

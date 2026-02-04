import { lazy } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  Sparkles, 
  Store, 
  Eye, 
  KeyRound, 
  Settings,
  type LucideIcon 
} from 'lucide-react';

// Lazy load all page components for code-splitting
const DashboardPage = lazy(() => import('@/pages/app/DashboardPage'));
const SubmitPage = lazy(() => import('@/pages/app/SubmitPage'));
const NFTPage = lazy(() => import('@/pages/app/NFTPage'));
const MarketplacePage = lazy(() => import('@/pages/app/MarketplacePage'));
const VisualizerPage = lazy(() => import('@/pages/app/VisualizerPage'));
const DisclosurePage = lazy(() => import('@/pages/app/DisclosurePage'));
const SettingsPage = lazy(() => import('@/pages/app/SettingsPage'));

export interface AppRoute {
  path: string;
  name: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  icon: LucideIcon;
  description?: string;
  // Dynamic import function for prefetching
  prefetch: () => Promise<unknown>;
}

export const appRoutes: AppRoute[] = [
  {
    path: '/app',
    name: 'Dashboard',
    component: DashboardPage,
    icon: LayoutDashboard,
    description: 'Overview of your credit applications',
    prefetch: () => import('@/pages/app/DashboardPage'),
  },
  {
    path: '/app/submit',
    name: 'Submit Data',
    component: SubmitPage,
    icon: Upload,
    description: 'Encrypt and submit financial data',
    prefetch: () => import('@/pages/app/SubmitPage'),
  },
  {
    path: '/app/nft',
    name: 'Credit NFTs',
    component: NFTPage,
    icon: Sparkles,
    description: 'Your verified credit proof tokens',
    prefetch: () => import('@/pages/app/NFTPage'),
  },
  {
    path: '/app/marketplace',
    name: 'Marketplace',
    component: MarketplacePage,
    icon: Store,
    description: 'Browse loan offers matching your tier',
    prefetch: () => import('@/pages/app/MarketplacePage'),
  },
  {
    path: '/app/visualizer',
    name: 'TEE Visualizer',
    component: VisualizerPage,
    icon: Eye,
    description: 'See confidential compute in action',
    prefetch: () => import('@/pages/app/VisualizerPage'),
  },
  {
    path: '/app/disclosure',
    name: 'Disclosure',
    component: DisclosurePage,
    icon: KeyRound,
    description: 'Manage selective data disclosure',
    prefetch: () => import('@/pages/app/DisclosurePage'),
  },
  {
    path: '/app/settings',
    name: 'Settings',
    component: SettingsPage,
    icon: Settings,
    description: 'Configure your preferences',
    prefetch: () => import('@/pages/app/SettingsPage'),
  },
];

export default appRoutes;

// Slide types for CredTrust mock data

export type HexColor = `#${string}`;

export interface LogoMicroEmblem {
  id: string;
  type: 'shield' | 'check' | 'key' | 'ledger' | 'fingerprint' | 'other';
  material?: 'enamel' | 'brushed-metal' | 'pearl' | 'matte';
  accent?: HexColor;
  glyph?: string;
}

export interface TapestryCrest {
  id: string;
  label: string;
  diameterPx?: number;
  outerRimMaterial?: string;
  baseColor: HexColor;
  accents: HexColor[];
  microEmblems: LogoMicroEmblem[];
  assetHint?: string;
}

export interface IconSpec {
  id: string;
  name: string;
  sizePx?: number;
  material?: 'enamel' | 'brushed-metal' | 'pearl' | 'matte';
  svgPathHint?: string;
}

export interface Bullet {
  id: string;
  heading: string;
  copy: string;
  icon: IconSpec;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  numeric?: number;
  unit?: string;
  icon?: IconSpec;
}

export interface HeroNode {
  id: string;
  title: string;
  description?: string;
  visualType: 'node' | 'ribbon' | 'tile' | 'vault' | 'tunnel' | 'engine';
  icon?: IconSpec;
  meta?: Record<string, unknown>;
}

export interface HeroVisual {
  id: string;
  narrative: string;
  nodes: HeroNode[];
  ribbonAccent?: HexColor;
  perspective?: 'flat' | 'slight' | 'deep';
}

export interface Slide {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  layoutHint?: 'logo-left' | 'center-hero' | 'full-bleed';
  crest: TapestryCrest;
  hero?: HeroVisual;
  bullets?: Bullet[];
  metrics?: Metric[];
  colors?: {
    bg: HexColor;
    text: HexColor;
    accent: HexColor;
    calloutBg?: HexColor;
  };
  createdAt?: string;
  updatedAt?: string;
}

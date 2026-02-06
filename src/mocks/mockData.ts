// Mock data for CredTrust slides
import type {
  Slide,
  TapestryCrest,
  LogoMicroEmblem,
  IconSpec,
  HeroNode,
} from '@/types/slides.types';

const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

/* -------------------------------------------------------------------------- */
/*                             Logo: Tapestry Crest                            */
/* -------------------------------------------------------------------------- */

const tapestryMicroEmblems: LogoMicroEmblem[] = [
  { id: id('em'), type: 'shield', material: 'enamel', accent: '#19BBA8', glyph: 'shield' },
  { id: id('em'), type: 'check', material: 'brushed-metal', accent: '#123141', glyph: 'check' },
  { id: id('em'), type: 'key', material: 'pearl', accent: '#E9E6E3', glyph: 'key' },
  { id: id('em'), type: 'ledger', material: 'matte', accent: '#0B2740', glyph: 'ledger' },
  { id: id('em'), type: 'fingerprint', material: 'enamel', accent: '#19BBA8', glyph: 'fp' },
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: id('em'),
    type: (['shield', 'check', 'key', 'ledger', 'fingerprint'] as const)[i % 5],
    material: (['enamel', 'brushed-metal', 'pearl', 'matte'] as const)[i % 4],
    accent: (['#19BBA8', '#123141', '#E9E6E3', '#0B2740'] as const)[i % 4],
    glyph: `g${i}`,
  })),
];

export const defaultTapestryCrest: TapestryCrest = {
  id: 'crest_tapestry_v1',
  label: 'Tapestry of Trust',
  diameterPx: 920,
  outerRimMaterial: 'brushed-silver',
  baseColor: '#123141',
  accents: ['#19BBA8', '#E9E6E3'],
  microEmblems: tapestryMicroEmblems,
  assetHint: 'credtrust-tapestry-v1.svg',
};

/* -------------------------------------------------------------------------- */
/*                                 Icon specs                                 */
/* -------------------------------------------------------------------------- */

const icon = (name: string, size = 44, material: IconSpec['material'] = 'enamel'): IconSpec => ({
  id: id('ic'),
  name,
  sizePx: size,
  material,
  svgPathHint: `/icons/${name}.svg`,
});

/* -------------------------------------------------------------------------- */
/*                                 Hero nodes                                  */
/* -------------------------------------------------------------------------- */

const heroNodesProblem: HeroNode[] = [
  {
    id: id('hn'),
    title: 'Fragment streams',
    visualType: 'ribbon',
    description: 'Three extraction streams show micro tiles leaving the tapestry and scattering across ledger islands.',
    icon: icon('fragment-stream', 36),
  },
  {
    id: id('hn'),
    title: 'Exposed Tiles',
    visualType: 'tile',
    description: 'Loose tiles showing exposed metadata and tiny padlock icons left open.',
    icon: icon('exposed-tile', 36, 'brushed-metal'),
  },
  {
    id: id('hn'),
    title: 'Reconciliation Cost',
    visualType: 'node',
    description: 'A boxed node representing time-consuming reconciliation processes.',
    icon: icon('reconcile', 36, 'matte'),
  },
];

const heroNodesSolution: HeroNode[] = [
  {
    id: id('hn'),
    title: 'Verification Ribbon',
    visualType: 'ribbon',
    description: 'A translucent ribbon of standardized proof-tiles that lock together seamlessly.',
    icon: icon('ribbon', 40),
    meta: { color: '#19BBA8' },
  },
  {
    id: id('hn'),
    title: 'Privacy Tunnel',
    visualType: 'tunnel',
    description: 'ZK/TEE-style tunnel that obfuscates payloads but emits attestations on exit (verified badges).',
    icon: icon('privacy-tunnel', 40, 'pearl'),
  },
  {
    id: id('hn'),
    title: 'Universal Vault',
    visualType: 'vault',
    description: 'Endpoint "universal verification node" that anchors attestations and issues badges.',
    icon: icon('vault', 44, 'brushed-metal'),
  },
];

/* -------------------------------------------------------------------------- */
/*                                 Slide data                                  */
/* -------------------------------------------------------------------------- */

export const mockSlides: Slide[] = [
  {
    id: 'slide_problem_v1',
    slug: 'problem',
    title: 'PROBLEM',
    subtitle: 'Why identity, custody and verification currently fail enterprises',
    layoutHint: 'logo-left',
    crest: defaultTapestryCrest,
    hero: {
      id: 'hero_problem_1',
      narrative: 'Tapestry unravels into fragments: identity and custody proofs scatter across systems leading to privacy exposure and long reconciliations.',
      nodes: heroNodesProblem,
      ribbonAccent: '#19BBA8',
      perspective: 'slight',
    },
    bullets: [
      {
        id: 'b_frag',
        heading: 'Fragmented identity & custody',
        copy: 'Many custodians, scattered proofs — identity trails split across ledgers, increasing reconciliation work and time.',
        icon: icon('shield-check', 44, 'enamel'),
      },
      {
        id: 'b_priv',
        heading: 'Data exposure & privacy risks',
        copy: 'Sensitive borrower and asset metadata are inadvertently exposed during verification and secondary processes.',
        icon: icon('padlock-open', 44, 'enamel'),
      },
      {
        id: 'b_std',
        heading: 'No universal verification standard',
        copy: 'Audits and cross-border checks require bespoke proofs — high operational cost and delayed settlement.',
        icon: icon('globe-verify', 44, 'enamel'),
      },
    ],
    metrics: [
      { id: 'm1', label: 'Avg reconciliation time', value: '14 days', numeric: 14, unit: 'days', icon: icon('clock') },
      { id: 'm2', label: 'Operational cost uplift', value: '+32%', numeric: 32, unit: '%', icon: icon('cost') },
    ],
    colors: {
      bg: '#FBF9F6',
      text: '#123141',
      accent: '#19BBA8',
      calloutBg: '#E9E6E3',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide_solution_v1',
    slug: 'solution',
    title: 'SOLUTION',
    subtitle: 'Unified private verification for identity, custody and audit.',
    layoutHint: 'logo-left',
    crest: defaultTapestryCrest,
    hero: {
      id: 'hero_solution_1',
      narrative: 'The tapestry re-weaves into a single verification ribbon that issues attestations and anchors proof.',
      nodes: heroNodesSolution,
      ribbonAccent: '#19BBA8',
      perspective: 'slight',
    },
    bullets: [
      {
        id: 's_unified',
        heading: 'Unified Proof Layer',
        copy: 'A single interoperable proof format that consolidates identity and custody signals across custodians.',
        icon: icon('tile-unify', 44, 'enamel'),
      },
      {
        id: 's_priv',
        heading: 'Privacy-Preserving Verification',
        copy: 'Zero-knowledge-style proofs and TEE-backed attestations preserve private metadata while proving truth.',
        icon: icon('zk-lock', 44, 'pearl'),
      },
      {
        id: 's_std',
        heading: 'Standards & Auditable Trails',
        copy: 'Standardized verification schemas produce auditable, cross-border proofs that reduce bespoke work.',
        icon: icon('audit-scroll', 44, 'brushed-metal'),
      },
    ],
    metrics: [
      { id: 'm3', label: 'Reconciliation time', value: '~1 day', numeric: 1, unit: 'day', icon: icon('fast') },
      { id: 'm4', label: 'Operational cost reduction', value: '~65%', numeric: 65, unit: '%', icon: icon('cost-down') },
    ],
    colors: {
      bg: '#FBF9F6',
      text: '#123141',
      accent: '#19BBA8',
      calloutBg: '#E9E6E3',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide_privacy_v1',
    slug: 'privacy-features',
    title: 'PRIVACY FEATURES',
    subtitle: 'Lean data, selective proofs, auditable privacy-preserving verification.',
    layoutHint: 'logo-left',
    crest: defaultTapestryCrest,
    hero: {
      id: 'hero_privacy_1',
      narrative: 'A pipeline showing data minimization -> selective disclosure -> ZK/TEE attestation -> auditable anchors.',
      nodes: [
        { id: 'hn_min', title: 'Data Minimization Gateway', visualType: 'engine', description: 'Filter', icon: icon('funnel', 36) },
        { id: 'hn_sel', title: 'Selective Disclosure Engine', visualType: 'engine', description: 'Redaction/Selective reveal', icon: icon('envelope', 36) },
        { id: 'hn_zk', title: 'Privacy-preserving Attestation Tunnel', visualType: 'tunnel', description: 'ZK/TEE zone', icon: icon('shield', 36) },
        { id: 'hn_audit', title: 'Controlled Auditor View', visualType: 'vault', description: 'Anchor-only view', icon: icon('anchor', 36) },
      ],
      ribbonAccent: '#19BBA8',
      perspective: 'slight',
    },
    bullets: [
      {
        id: 'p_min',
        heading: 'Data Minimization',
        copy: 'Transmit only required assertions — raw metadata never leaves the custodian.',
        icon: icon('minimize', 40, 'enamel'),
      },
      {
        id: 'p_sel',
        heading: 'Selective Disclosure',
        copy: 'Reveal specific, verifiable attributes without exposing underlying records.',
        icon: icon('reveal', 40, 'enamel'),
      },
      {
        id: 'p_zk',
        heading: 'Zero-knowledge Attestations',
        copy: 'Prove correctness of statements with ZK proofs that hide secrets.',
        icon: icon('zk', 40, 'pearl'),
      },
      {
        id: 'p_tee',
        heading: 'Trusted Execution Attestations',
        copy: 'Run sensitive checks inside TEEs for strong hardware-backed guarantees.',
        icon: icon('tee', 40, 'brushed-metal'),
      },
      {
        id: 'p_aud',
        heading: 'Auditable Anchors & Revocation',
        copy: 'Anchor concise proofs on-chain with revocation flags — auditors see attestations, not private data.',
        icon: icon('anchor-audit', 40, 'brushed-metal'),
      },
    ],
    metrics: [
      { id: 'pm1', label: 'Data exposure reduction', value: '~90%', numeric: 90, unit: '%', icon: icon('shield-percent') },
      { id: 'pm2', label: 'Verification latency', value: '<24 hours', numeric: 24, unit: 'hours', icon: icon('clock') },
    ],
    colors: {
      bg: '#FBF9F6',
      text: '#123141',
      accent: '#19BBA8',
      calloutBg: '#E9E6E3',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/* -------------------------------------------------------------------------- */
/*                              Export for API                                 */
/* -------------------------------------------------------------------------- */

export default {
  slides: mockSlides,
};

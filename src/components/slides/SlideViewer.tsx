import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, Clock, TrendingDown, Layers, Eye, FileCheck, LucideIcon } from 'lucide-react';
import { fetchSlideBySlug } from '@/mocks/api';
import type { Slide, Bullet } from '@/types/slides.types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  'shield-check': Shield,
  'padlock-open': Lock,
  'globe-verify': Globe,
  'clock': Clock,
  'cost': TrendingDown,
  'tile-unify': Layers,
  'zk-lock': Lock,
  'audit-scroll': FileCheck,
  'fast': Clock,
  'cost-down': TrendingDown,
  'minimize': Eye,
  'reveal': Eye,
  'zk': Lock,
  'tee': Shield,
  'anchor-audit': FileCheck,
  'shield-percent': Shield,
  default: Shield,
};

function BulletIcon({ name }: { name: string }) {
  const Icon = iconMap[name] || iconMap.default;
  return <Icon className="h-5 w-5" />;
}

interface SlideViewerProps {
  slug?: string;
  className?: string;
}

export function SlideViewer({ slug = 'solution', className }: SlideViewerProps) {
  const [slide, setSlide] = useState<Slide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchSlideBySlug(slug)
      .then(s => {
        if (mounted) {
          if (s) {
            setSlide(s);
          } else {
            setError('Slide not found');
          }
        }
      })
      .catch(e => {
        if (mounted) setError(String(e));
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-12", className)}>
        <div className="animate-pulse text-muted-foreground">Loading slide…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center p-12", className)}>
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  if (!slide) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Left: Crest */}
        <div className="lg:w-2/5 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30">
          <div className="relative">
            <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-2xl border border-border">
              <svg width="120" height="120" viewBox="0 0 160 160" fill="none" className="drop-shadow-lg">
                <circle cx="80" cy="80" r="78" stroke="currentColor" strokeWidth="2" className="text-border" fill="hsl(var(--card))" />
                <text
                  x="50%"
                  y="56%"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="56"
                  className="fill-primary"
                  style={{ fontVariantCaps: 'small-caps' }}
                >
                  CT
                </text>
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground text-center">
            {slide.crest.label}
          </p>
        </div>

        {/* Right: Content */}
        <div className="lg:w-3/5 p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground tracking-wide">
              {slide.title}
            </h2>
            <p className="text-muted-foreground mt-2">{slide.subtitle}</p>
          </div>

          {/* Hero narrative */}
          {slide.hero && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4">{slide.hero.narrative}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {slide.hero.nodes.map(node => (
                  <motion.div
                    key={node.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <p className="font-semibold text-foreground text-sm">{node.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{node.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Bullets */}
          {slide.bullets && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {slide.bullets.map((bullet: Bullet) => (
                <div
                  key={bullet.id}
                  className="flex gap-3 p-3 rounded-lg bg-card/50 border border-border/50"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <BulletIcon name={bullet.icon.name} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{bullet.heading}</p>
                    <p className="text-xs text-muted-foreground mt-1">{bullet.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Metrics */}
          {slide.metrics && (
            <div className="mt-auto">
              <div className="inline-flex gap-6 p-4 rounded-xl bg-muted/50 border border-border">
                {slide.metrics.map(metric => (
                  <div key={metric.id} className="text-center">
                    <p className="text-2xl font-bold text-primary">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default SlideViewer;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NeoObject } from '@/lib/types';
import { calculateRisk, formatDistance, formatVelocity, formatDiameter } from '@/lib/riskEngine';
import { RiskBadge } from '@/components/RiskBadge';
import { AlertTriangle, ArrowRight, Ruler, Zap, Globe, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NeoCardProps {
  neo: NeoObject;
  index?: number;
}

export function NeoCard({ neo, index = 0 }: NeoCardProps) {
  const approach = neo.closeApproachData[0];
  if (!approach) return null;

  const risk = calculateRisk({
    isHazardous: neo.isPotentiallyHazardous,
    diameterMaxKm: neo.estimatedDiameter.maxKm,
    missDistanceKm: approach.missDistance.kilometers,
    velocityKmH: approach.velocity.kmPerHour,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/asteroid/${neo.id}`}
        className={cn(
          'block rounded-xl p-5 transition-all duration-300 group',
          'bg-card border border-border/60 hover:border-primary/30',
          'hover:shadow-[0_0_30px_hsl(var(--primary)/0.08)]'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate text-sm group-hover:text-primary transition-colors">
              {neo.name}
            </h3>
            {neo.isPotentiallyHazardous && (
              <div className="flex items-center gap-1 mt-1 text-risk-high text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>Potentially Hazardous</span>
              </div>
            )}
          </div>
          <RiskBadge level={risk.level} score={risk.score} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ruler className="w-3.5 h-3.5 text-primary/70 shrink-0" />
            <span className="truncate">{formatDiameter(neo.estimatedDiameter.minKm, neo.estimatedDiameter.maxKm)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-accent/70 shrink-0" />
            <span className="truncate">{formatVelocity(approach.velocity.kmPerHour)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="w-3.5 h-3.5 text-primary/70 shrink-0" />
            <span className="truncate">{formatDistance(approach.missDistance.kilometers)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-accent/70 shrink-0" />
            <span className="truncate">{approach.date}</span>
          </div>
        </div>

        {/* Lunar distance */}
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {approach.missDistance.lunar.toFixed(1)} lunar distances
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}

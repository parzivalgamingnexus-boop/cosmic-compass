import { cn } from '@/lib/utils';
import { RiskLevel } from '@/lib/riskEngine';

interface RiskBadgeProps {
  level: RiskLevel;
  score: number;
  size?: 'sm' | 'md';
}

const levelConfig: Record<RiskLevel, { bg: string; text: string; dot: string; label: string }> = {
  low: {
    bg: 'bg-risk-low/15',
    text: 'text-risk-low',
    dot: 'bg-risk-low',
    label: 'LOW',
  },
  medium: {
    bg: 'bg-risk-medium/15',
    text: 'text-risk-medium',
    dot: 'bg-risk-medium',
    label: 'MEDIUM',
  },
  high: {
    bg: 'bg-risk-high/15',
    text: 'text-risk-high',
    dot: 'bg-risk-high',
    label: 'HIGH',
  },
  critical: {
    bg: 'bg-risk-critical/15',
    text: 'text-risk-critical',
    dot: 'bg-risk-critical',
    label: 'CRITICAL',
  },
};

export function RiskBadge({ level, score, size = 'sm' }: RiskBadgeProps) {
  const config = levelConfig[level];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        config.bg,
        config.text,
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span
        className={cn(
          'rounded-full',
          config.dot,
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
          level === 'critical' && 'animate-pulse-glow'
        )}
      />
      {config.label}
      <span className="text-muted-foreground font-normal">({score})</span>
    </div>
  );
}

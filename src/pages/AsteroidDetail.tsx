import { useParams, Link } from 'react-router-dom';
import { useNeoLookup } from '@/hooks/useNeoData';
import { calculateRisk, formatDistance, formatVelocity, formatDiameter } from '@/lib/riskEngine';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Globe,
  Zap,
  Ruler,
  Calendar,
  Shield,
} from 'lucide-react';

export default function AsteroidDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: neo, isLoading, error } = useNeoLookup(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading asteroid data...</p>
        </div>
      </div>
    );
  }

  if (error || !neo) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Asteroid Not Found</h2>
          <p className="text-muted-foreground text-sm mb-6">Could not load data for this asteroid.</p>
          <Button variant="outline-glow" asChild>
            <Link to="/dashboard"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const approach = neo.closeApproachData[0];
  const risk = approach
    ? calculateRisk({
        isHazardous: neo.isPotentiallyHazardous,
        diameterMaxKm: neo.estimatedDiameter.maxKm,
        missDistanceKm: approach.missDistance.kilometers,
        velocityKmH: approach.velocity.kmPerHour,
      })
    : null;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{neo.name}</h1>
              <p className="text-muted-foreground text-sm">NASA ID: {neo.id}</p>
            </div>
            {risk && <RiskBadge level={risk.level} score={risk.score} size="md" />}
          </div>

          {neo.isPotentiallyHazardous && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-risk-high/10 text-risk-high text-sm">
              <AlertTriangle className="w-4 h-4" />
              Potentially Hazardous Asteroid
            </div>
          )}
        </motion.div>

        {/* Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 gap-4 mb-8"
        >
          <InfoCard
            icon={Ruler}
            label="Estimated Diameter"
            value={formatDiameter(neo.estimatedDiameter.minKm, neo.estimatedDiameter.maxKm)}
          />
          {approach && (
            <>
              <InfoCard
                icon={Zap}
                label="Relative Velocity"
                value={formatVelocity(approach.velocity.kmPerHour)}
              />
              <InfoCard
                icon={Globe}
                label="Miss Distance"
                value={`${formatDistance(approach.missDistance.kilometers)} (${approach.missDistance.lunar.toFixed(1)} LD)`}
              />
              <InfoCard
                icon={Calendar}
                label="Close Approach Date"
                value={approach.dateFull || approach.date}
              />
            </>
          )}
        </motion.div>

        {/* Risk Breakdown */}
        {risk && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Risk Analysis</h2>
            </div>

            <div className="space-y-4">
              <RiskBar label="Hazardous Status" value={risk.factors.hazardous} max={30} />
              <RiskBar label="Diameter Factor" value={risk.factors.diameter} max={25} />
              <RiskBar label="Proximity Factor" value={risk.factors.distance} max={25} />
              <RiskBar label="Velocity Factor" value={risk.factors.velocity} max={20} />
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Risk Score</span>
              <span className="text-2xl font-bold">{risk.score}/100</span>
            </div>
          </motion.div>
        )}

        {/* Close Approach History */}
        {neo.closeApproachData.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6 mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">Close Approach History</h2>
            <div className="space-y-3">
              {neo.closeApproachData.slice(0, 10).map((ca, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="text-sm">{ca.dateFull || ca.date}</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatDistance(ca.missDistance.kilometers)}</span>
                    <span>{formatVelocity(ca.velocity.kmPerHour)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* External Link */}
        <div className="flex gap-3">
          <Button variant="outline-glow" asChild>
            <a href={neo.nasaJplUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on NASA JPL
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function RiskBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color =
    pct >= 75 ? 'bg-risk-critical' : pct >= 50 ? 'bg-risk-high' : pct >= 25 ? 'bg-risk-medium' : 'bg-risk-low';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}/{max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

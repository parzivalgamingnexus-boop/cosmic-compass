import { useState, useMemo } from 'react';
import { useNeoFeed } from '@/hooks/useNeoData';
import { NeoCard } from '@/components/NeoCard';
import { NeoFilters } from '@/components/NeoFilters';
import { calculateRisk } from '@/lib/riskEngine';
import { format, subDays } from 'date-fns';
import { AlertTriangle, Activity, Globe, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const today = new Date();
  const [startDate] = useState(() => format(subDays(today, 3), 'yyyy-MM-dd'));
  const [endDate] = useState(() => format(today, 'yyyy-MM-dd'));
  const [searchQuery, setSearchQuery] = useState('');
  const [hazardousOnly, setHazardousOnly] = useState(false);
  const [sortBy, setSortBy] = useState('risk');

  const { data, isLoading, error } = useNeoFeed(startDate, endDate);

  const filteredNeos = useMemo(() => {
    if (!data?.neos) return [];
    let result = [...data.neos];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((neo) =>
        neo.name.toLowerCase().includes(q) || neo.id.includes(q)
      );
    }

    if (hazardousOnly) {
      result = result.filter((neo) => neo.isPotentiallyHazardous);
    }

    result.sort((a, b) => {
      const aApproach = a.closeApproachData[0];
      const bApproach = b.closeApproachData[0];
      if (!aApproach || !bApproach) return 0;

      switch (sortBy) {
        case 'distance':
          return aApproach.missDistance.kilometers - bApproach.missDistance.kilometers;
        case 'size':
          return b.estimatedDiameter.maxKm - a.estimatedDiameter.maxKm;
        case 'velocity':
          return bApproach.velocity.kmPerHour - aApproach.velocity.kmPerHour;
        case 'risk': {
          const aRisk = calculateRisk({
            isHazardous: a.isPotentiallyHazardous,
            diameterMaxKm: a.estimatedDiameter.maxKm,
            missDistanceKm: aApproach.missDistance.kilometers,
            velocityKmH: aApproach.velocity.kmPerHour,
          });
          const bRisk = calculateRisk({
            isHazardous: b.isPotentiallyHazardous,
            diameterMaxKm: b.estimatedDiameter.maxKm,
            missDistanceKm: bApproach.missDistance.kilometers,
            velocityKmH: bApproach.velocity.kmPerHour,
          });
          return bRisk.score - aRisk.score;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [data?.neos, searchQuery, hazardousOnly, sortBy]);

  const stats = useMemo(() => {
    if (!data?.neos) return null;
    const hazardousCount = data.neos.filter((n) => n.isPotentiallyHazardous).length;
    const closest = data.neos.reduce((min, neo) => {
      const dist = neo.closeApproachData[0]?.missDistance.kilometers ?? Infinity;
      return dist < min ? dist : min;
    }, Infinity);
    const fastest = data.neos.reduce((max, neo) => {
      const vel = neo.closeApproachData[0]?.velocity.kmPerHour ?? 0;
      return vel > max ? vel : max;
    }, 0);
    return { total: data.elementCount, hazardousCount, closest, fastest };
  }, [data]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            <span className="text-gradient-primary">NEO</span> Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Tracking near-Earth objects from {startDate} to {endDate}
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Activity, label: 'Total NEOs', value: stats.total, color: 'text-primary' },
              { icon: AlertTriangle, label: 'Hazardous', value: stats.hazardousCount, color: 'text-risk-high' },
              { icon: Globe, label: 'Closest Approach', value: `${(stats.closest / 1_000_000).toFixed(1)}M km`, color: 'text-primary' },
              { icon: Zap, label: 'Fastest', value: `${(stats.fastest / 1_000).toFixed(0)}K km/h`, color: 'text-accent' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <NeoFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            hazardousOnly={hazardousOnly}
            onHazardousChange={setHazardousOnly}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Fetching asteroid data from NASA...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Data</h3>
            <p className="text-muted-foreground text-sm">
              Could not connect to NASA's NEO API. Please try again later.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredNeos.length} of {data?.elementCount ?? 0} asteroids
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNeos.map((neo, i) => (
                <NeoCard key={neo.id} neo={neo} index={i} />
              ))}
            </div>
            {filteredNeos.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No asteroids match your filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

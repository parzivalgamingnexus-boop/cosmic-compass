import { useQuery } from '@tanstack/react-query';
import { NASA_API_KEY, NASA_NEO_FEED_URL, NASA_NEO_LOOKUP_URL } from '@/lib/constants';
import { NeoObject } from '@/lib/types';
import { format, subDays } from 'date-fns';

function transformNeo(raw: any): NeoObject {
  return {
    id: raw.id,
    name: raw.name,
    nasaJplUrl: raw.nasa_jpl_url,
    absoluteMagnitude: raw.absolute_magnitude_h,
    estimatedDiameter: {
      minKm: raw.estimated_diameter.kilometers.estimated_diameter_min,
      maxKm: raw.estimated_diameter.kilometers.estimated_diameter_max,
    },
    isPotentiallyHazardous: raw.is_potentially_hazardous_asteroid,
    closeApproachData: (raw.close_approach_data || []).map((ca: any) => ({
      date: ca.close_approach_date,
      dateFull: ca.close_approach_date_full,
      velocity: {
        kmPerHour: parseFloat(ca.relative_velocity.kilometers_per_hour),
      },
      missDistance: {
        astronomical: parseFloat(ca.miss_distance.astronomical),
        lunar: parseFloat(ca.miss_distance.lunar),
        kilometers: parseFloat(ca.miss_distance.kilometers),
      },
    })),
  };
}

export function useNeoFeed(startDate?: string, endDate?: string) {
  const today = new Date();
  const start = startDate || format(subDays(today, 2), 'yyyy-MM-dd');
  const end = endDate || format(today, 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['neo-feed', start, end],
    queryFn: async () => {
      const url = `${NASA_NEO_FEED_URL}?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch NEO data from NASA');
      const data = await response.json();

      const allNeos: NeoObject[] = [];
      for (const date of Object.keys(data.near_earth_objects)) {
        for (const neo of data.near_earth_objects[date]) {
          allNeos.push(transformNeo(neo));
        }
      }

      return {
        elementCount: data.element_count as number,
        neos: allNeos,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useNeoLookup(id: string) {
  return useQuery({
    queryKey: ['neo-lookup', id],
    queryFn: async () => {
      const url = `${NASA_NEO_LOOKUP_URL}/${id}?api_key=${NASA_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch asteroid data');
      const raw = await response.json();
      return transformNeo(raw);
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

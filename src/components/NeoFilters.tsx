import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface NeoFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  hazardousOnly: boolean;
  onHazardousChange: (value: boolean) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function NeoFilters({
  searchQuery,
  onSearchChange,
  hazardousOnly,
  onHazardousChange,
  sortBy,
  onSortChange,
}: NeoFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search asteroids..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card border-border/60"
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="hazardous-filter"
          checked={hazardousOnly}
          onCheckedChange={onHazardousChange}
        />
        <Label htmlFor="hazardous-filter" className="text-sm text-muted-foreground cursor-pointer whitespace-nowrap">
          Hazardous Only
        </Label>
      </div>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px] bg-card border-border/60">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="distance">Closest First</SelectItem>
          <SelectItem value="size">Largest First</SelectItem>
          <SelectItem value="velocity">Fastest First</SelectItem>
          <SelectItem value="risk">Highest Risk</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

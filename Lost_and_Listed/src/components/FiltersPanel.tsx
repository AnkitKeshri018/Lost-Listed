import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Category } from '@/contexts/AppContext';

interface FiltersPanelProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  showTypeFilter?: boolean;
  itemType?: string;
  onTypeChange?: (value: string) => void;
}

const FiltersPanel = ({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  showTypeFilter,
  itemType,
  onTypeChange,
}: FiltersPanelProps) => {
  const categories: (Category | 'all')[] = ['all', 'electronics', 'clothing', 'books', 'accessories', 'furniture', 'other'];

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {showTypeFilter && onTypeChange && (
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={itemType} onValueChange={onTypeChange}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="found">Found</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sortBy !== undefined && onSortChange && (
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onSearchChange('');
          onCategoryChange('all');
          if (onTypeChange) onTypeChange('all');
          if (onSortChange) onSortChange('date-desc');
        }}
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default FiltersPanel;

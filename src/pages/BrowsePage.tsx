import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SortAsc } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import CarCard from '@/components/CarCard';
import FilterSidebar from '@/components/FilterSidebar';
import type { FilterState } from '@/types';

const DEFAULT_FILTERS: FilterState = {
  searchText: '',
  make: '',
  model: '',
  yearMin: '',
  yearMax: '',
  priceMin: '',
  priceMax: '',
  mileageMax: '',
  bodyStyle: '',
  transmission: '',
  fuelType: '',
  driveType: '',
  condition: '',
  location: '',
};

export default function BrowsePage() {
  const { listings } = useListings();
  const [searchParams] = useSearchParams();
  const initialMake = searchParams.get('make') || '';

  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, make: initialMake });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let result = [...listings];

    if (filters.searchText) {
      const q = filters.searchText.toLowerCase();
      result = result.filter((c) =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        String(c.year).includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    if (filters.make) result = result.filter((c) => c.make === filters.make);
    if (filters.model) result = result.filter((c) => c.model.toLowerCase().includes(filters.model.toLowerCase()));
    if (filters.yearMin) result = result.filter((c) => c.year >= Number(filters.yearMin));
    if (filters.yearMax) result = result.filter((c) => c.year <= Number(filters.yearMax));
    if (filters.priceMin) result = result.filter((c) => c.price >= Number(filters.priceMin));
    if (filters.priceMax) result = result.filter((c) => c.price <= Number(filters.priceMax));
    if (filters.mileageMax) result = result.filter((c) => c.mileage <= Number(filters.mileageMax));
    if (filters.bodyStyle) result = result.filter((c) => c.bodyStyle === filters.bodyStyle);
    if (filters.transmission) result = result.filter((c) => c.transmission === filters.transmission);
    if (filters.fuelType) result = result.filter((c) => c.fuelType === filters.fuelType);
    if (filters.driveType) result = result.filter((c) => c.driveType === filters.driveType);
    if (filters.condition) result = result.filter((c) => c.condition === filters.condition);
    if (filters.location) result = result.filter((c) => c.location.toLowerCase().includes(filters.location.toLowerCase()));

    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'year_asc': result.sort((a, b) => a.year - b.year); break;
      case 'year_desc': result.sort((a, b) => b.year - a.year); break;
      case 'mileage': result.sort((a, b) => a.mileage - b.mileage); break;
      default: result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [listings, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>Browse Classic Cars</h1>
        <p className="text-sm" style={{ color: '#a0a0a0' }}>{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <SortAsc size={16} style={{ color: '#c9a227' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm px-2 py-1 rounded outline-none"
                style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' }}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest</option>
                <option value="year_asc">Year: Oldest</option>
                <option value="mileage">Lowest Mileage</option>
              </select>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className="p-2 rounded"
                style={{ backgroundColor: viewMode === 'grid' ? '#c9a227' : 'transparent', color: viewMode === 'grid' ? '#1a1a2e' : '#a0a0a0' }}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded"
                style={{ backgroundColor: viewMode === 'list' ? '#c9a227' : 'transparent', color: viewMode === 'list' ? '#1a1a2e' : '#a0a0a0' }}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: '#a0a0a0' }}>
              <p className="text-xl">No cars match your filters.</p>
              <button onClick={() => setFilters(DEFAULT_FILTERS)} className="mt-4 px-4 py-2 rounded" style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}>Clear Filters</button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-4'}>
              {filtered.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

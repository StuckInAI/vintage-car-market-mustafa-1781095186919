import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    make: searchParams.get('make') || '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...listings];

    if (filters.searchText) {
      const q = filters.searchText.toLowerCase();
      result = result.filter(
        (c) =>
          c.make.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.year.toString().includes(q) ||
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

    if (sortBy === 'newest') result.sort((a, b) => b.createdAt - a.createdAt);
    else if (sortBy === 'oldest') result.sort((a, b) => a.createdAt - b.createdAt);
    else if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'year_asc') result.sort((a, b) => a.year - b.year);
    else if (sortBy === 'year_desc') result.sort((a, b) => b.year - a.year);

    return result;
  }, [listings, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
          Browse <span style={{ color: '#c9a227' }}>Classic Cars</span>
        </h1>
        <p className="text-sm" style={{ color: '#a0a0a0' }}>{filtered.length} listings found</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
        </aside>

        {/* Mobile sidebar toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-4 py-2 rounded text-sm font-semibold"
            style={{ backgroundColor: '#1e1e32', color: '#c9a227', border: '1px solid rgba(201,162,39,0.3)' }}
          >
            {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
          {sidebarOpen && (
            <div className="mt-4">
              <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* Sort */}
          <div className="flex items-center justify-end mb-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded text-sm outline-none"
              style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="year_asc">Year: Oldest First</option>
              <option value="year_desc">Year: Newest First</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: '#a0a0a0' }}>
              <p className="text-lg mb-2">No listings found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

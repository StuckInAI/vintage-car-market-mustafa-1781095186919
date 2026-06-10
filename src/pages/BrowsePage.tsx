import { useState, useMemo } from 'react';
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
  location: '',
  condition: '',
};

export default function BrowsePage() {
  const { listings } = useListings();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('newest');

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
    if (filters.yearMin) result = result.filter((c) => c.year >= parseInt(filters.yearMin));
    if (filters.yearMax) result = result.filter((c) => c.year <= parseInt(filters.yearMax));
    if (filters.priceMin) result = result.filter((c) => c.price >= parseInt(filters.priceMin));
    if (filters.priceMax) result = result.filter((c) => c.price <= parseInt(filters.priceMax));
    if (filters.mileageMax) result = result.filter((c) => c.mileage <= parseInt(filters.mileageMax));
    if (filters.bodyStyle) result = result.filter((c) => c.bodyStyle === filters.bodyStyle);
    if (filters.transmission) result = result.filter((c) => c.transmission === filters.transmission);
    if (filters.fuelType) result = result.filter((c) => c.fuelType === filters.fuelType);
    if (filters.driveType) result = result.filter((c) => c.driveType === filters.driveType);
    if (filters.location) result = result.filter((c) => c.location.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.condition) result = result.filter((c) => c.condition === filters.condition);

    switch (sortBy) {
      case 'newest': result.sort((a, b) => b.createdAt - a.createdAt); break;
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'year_desc': result.sort((a, b) => b.year - a.year); break;
      case 'year_asc': result.sort((a, b) => a.year - b.year); break;
    }

    return result;
  }, [listings, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>Browse Classic Cars</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-72 flex-shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: '#a0a0a0' }}>{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded text-sm outline-none"
              style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' }}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="year_desc">Year: Newest</option>
              <option value="year_asc">Year: Oldest</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: '#a0a0a0' }}>
              <p className="text-xl mb-2">No listings found</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

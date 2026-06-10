import { useState, useMemo } from 'react';
import { useListings } from '@/context/ListingsContext';
import CarCard from '@/components/CarCard';
import FilterSidebar from '@/components/FilterSidebar';
import type { FilterState } from '@/types';

const defaultFilters: FilterState = {
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
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showSidebar, setShowSidebar] = useState(false);

  const filtered = useMemo(() => {
    return listings.filter((car) => {
      if (filters.searchText) {
        const s = filters.searchText.toLowerCase();
        const combined = `${car.make} ${car.model} ${car.year} ${car.trim || ''}`.toLowerCase();
        if (!combined.includes(s)) return false;
      }
      if (filters.make && car.make !== filters.make) return false;
      if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
      if (filters.yearMin && car.year < parseInt(filters.yearMin)) return false;
      if (filters.yearMax && car.year > parseInt(filters.yearMax)) return false;
      if (filters.priceMin && car.price < parseInt(filters.priceMin)) return false;
      if (filters.priceMax && car.price > parseInt(filters.priceMax)) return false;
      if (filters.mileageMax && car.mileage > parseInt(filters.mileageMax)) return false;
      if (filters.bodyStyle && car.bodyStyle !== filters.bodyStyle) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
      if (filters.driveType && car.driveType !== filters.driveType) return false;
      if (filters.condition && car.condition !== filters.condition) return false;
      if (filters.location && !car.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      return true;
    });
  }, [listings, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>Browse Classic Cars</h1>
        <button
          className="md:hidden px-4 py-2 rounded text-sm"
          style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227' }}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          Filters
        </button>
      </div>
      <div className="flex gap-6">
        <aside className={`w-64 flex-shrink-0 ${showSidebar ? 'block' : 'hidden'} md:block`}>
          <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
        </aside>
        <div className="flex-1">
          <p className="text-sm mb-4" style={{ color: '#a0a0a0' }}>{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          ) : (
            <div className="text-center py-20" style={{ color: '#a0a0a0' }}>
              <p className="text-lg">No listings match your filters.</p>
              <button onClick={() => setFilters(defaultFilters)} className="mt-4 text-sm" style={{ color: '#c9a227' }}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

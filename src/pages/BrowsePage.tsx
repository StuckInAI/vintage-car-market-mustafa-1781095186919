import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, ArrowUpDown } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import CarCard from '@/components/CarCard';
import FilterSidebar from '@/components/FilterSidebar';
import type { FilterState, CarListing } from '@/types';
import { getDefaultFilters } from '@/lib/utils';

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const { listings } = useListings();
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...getDefaultFilters(),
    make: searchParams.get('make') || '',
    searchText: searchParams.get('search') || '',
  }));
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const applyFilters = (cars: CarListing[]): CarListing[] => {
    return cars.filter((car) => {
      if (filters.make && car.make !== filters.make) return false;
      if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
      if (filters.yearMin && car.year < parseInt(filters.yearMin)) return false;
      if (filters.yearMax && car.year > parseInt(filters.yearMax)) return false;
      if (filters.priceMin && car.price < parseInt(filters.priceMin)) return false;
      if (filters.priceMax && car.price > parseInt(filters.priceMax)) return false;
      if (filters.mileageMax && car.mileage > parseInt(filters.mileageMax)) return false;
      if (filters.condition && car.condition !== filters.condition) return false;
      if (filters.bodyStyle && car.bodyStyle !== filters.bodyStyle) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
      if (filters.driveType && car.driveType !== filters.driveType) return false;
      if (filters.location && !car.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.searchText) {
        const q = filters.searchText.toLowerCase();
        const match = car.make.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.year.toString().includes(q) ||
          car.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  };

  const applySorting = (cars: CarListing[]): CarListing[] => {
    const sorted = [...cars];
    switch (sortBy) {
      case 'newest': return sorted.sort((a, b) => b.createdAt - a.createdAt);
      case 'oldest': return sorted.sort((a, b) => a.createdAt - b.createdAt);
      case 'price_asc': return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc': return sorted.sort((a, b) => b.price - a.price);
      case 'year_desc': return sorted.sort((a, b) => b.year - a.year);
      case 'year_asc': return sorted.sort((a, b) => a.year - b.year);
      case 'mileage_asc': return sorted.sort((a, b) => a.mileage - b.mileage);
      default: return sorted;
    }
  };

  const filtered = applySorting(applyFilters(listings));

  const makes = Array.from(new Set(filtered.map((c) => c.make))).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>Browse Classic Cars</h1>
        <p className="text-sm mt-1" style={{ color: '#a0a0a0' }}>{filtered.length} vehicles found</p>
        <div className="ornament-line mt-3"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters(getDefaultFilters())} />
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Sort & View Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-3 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} style={{ color: '#c9a227' }} />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-sm px-2 py-1 rounded outline-none"
                style={{ backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest</option>
                <option value="year_asc">Year: Oldest</option>
                <option value="mileage_asc">Mileage: Low to High</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setViewMode('grid')} className="p-2 rounded" style={{ backgroundColor: viewMode === 'grid' ? '#c9a227' : '#111125', color: viewMode === 'grid' ? '#1a1a2e' : '#e8e8e8' }}>
                <Grid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className="p-2 rounded" style={{ backgroundColor: viewMode === 'list' ? '#c9a227' : '#111125', color: viewMode === 'list' ? '#1a1a2e' : '#e8e8e8' }}>
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Makes Quick Filter */}
          {makes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {makes.map((make) => (
                <button
                  key={make}
                  onClick={() => setFilters((f) => ({ ...f, make: f.make === make ? '' : make }))}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: filters.make === make ? '#c9a227' : 'rgba(201,162,39,0.1)',
                    color: filters.make === make ? '#1a1a2e' : '#c9a227',
                    border: '1px solid rgba(201,162,39,0.4)',
                  }}
                >
                  {make}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: '#a0a0a0' }}>
              <p className="text-xl mb-2">No vehicles match your search.</p>
              <p className="text-sm">Try adjusting your filters or <button onClick={() => setFilters(getDefaultFilters())} style={{ color: '#c9a227' }}>clear all filters</button>.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((car) => (
                <div key={car.id} className="flex gap-4 rounded-lg p-4" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
                  <div className="w-40 h-28 flex-shrink-0 rounded overflow-hidden" style={{ backgroundColor: '#111125' }}>
                    {car.images && car.images.length > 0 ? (
                      <img src={car.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="60" height="40" viewBox="0 0 100 60" fill="none">
                          <path d="M5 50 L5 30 L20 10 L50 10 L65 20 L90 20 L95 35 L95 50 Z" stroke="#c9a227" strokeWidth="2" fill="none" />
                          <circle cx="22" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                          <circle cx="75" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold" style={{ color: '#e8e8e8' }}>{car.year} {car.make} {car.model} {car.trim}</h3>
                    <p className="text-xs mt-1" style={{ color: '#a0a0a0' }}>{car.mileage.toLocaleString()} mi · {car.condition} · {car.location}</p>
                    <p className="text-xs mt-1" style={{ color: '#888' }}>{car.engineSize} {car.cylinders} · {car.transmission} · {car.bodyStyle}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold" style={{ color: '#c9a227' }}>${car.price.toLocaleString()}</div>
                    <div className="text-xs mt-1" style={{ color: '#a0a0a0' }}>{car.negotiable ? 'Negotiable' : 'Firm'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

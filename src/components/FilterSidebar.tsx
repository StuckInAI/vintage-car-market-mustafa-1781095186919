import { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';
import type { FilterState } from '@/types';
import { CAR_MAKES, BODY_STYLES, TRANSMISSIONS, FUEL_TYPES, DRIVE_TYPES, CONDITIONS } from '@/lib/constants';

type FilterSidebarProps = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
};

export default function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  const [sections, setSections] = useState({
    basic: true,
    price: true,
    specs: false,
    condition: false,
  });

  const toggle = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const inputClass = "w-full px-3 py-2 rounded text-sm outline-none focus:ring-1";
  const inputStyle = { backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' };

  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base flex items-center gap-2" style={{ color: '#c9a227' }}>
          <SlidersHorizontal size={16} /> Filters
        </h3>
        <button onClick={onReset} className="text-xs flex items-center gap-1 hover:text-yellow-400 transition-colors" style={{ color: '#a0a0a0' }}>
          <X size={12} /> Reset
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search (make, model, year...)"
          value={filters.searchText}
          onChange={(e: any) => update('searchText', e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Basic */}
      <div className="mb-3">
        <button className="w-full flex justify-between items-center py-2 text-sm font-semibold" style={{ color: '#e8e8e8', borderBottom: '1px solid rgba(201,162,39,0.2)' }} onClick={() => toggle('basic')}>
          Make, Model & Year {sections.basic ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {sections.basic && (
          <div className="pt-3 space-y-2">
            <select value={filters.make} onChange={(e: any) => update('make', e.target.value)} className={inputClass} style={inputStyle}>
              <option value="">All Makes</option>
              {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input
              type="text"
              placeholder="Model"
              value={filters.model}
              onChange={(e: any) => update('model', e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
            <div className="flex gap-2">
              <input type="number" placeholder="Year From" value={filters.yearMin} onChange={(e: any) => update('yearMin', e.target.value)} className={inputClass} style={inputStyle} />
              <input type="number" placeholder="Year To" value={filters.yearMax} onChange={(e: any) => update('yearMax', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-3">
        <button className="w-full flex justify-between items-center py-2 text-sm font-semibold" style={{ color: '#e8e8e8', borderBottom: '1px solid rgba(201,162,39,0.2)' }} onClick={() => toggle('price')}>
          Price Range {sections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {sections.price && (
          <div className="pt-3 space-y-2">
            <div className="flex gap-2">
              <input type="number" placeholder="Min $" value={filters.priceMin} onChange={(e: any) => update('priceMin', e.target.value)} className={inputClass} style={inputStyle} />
              <input type="number" placeholder="Max $" value={filters.priceMax} onChange={(e: any) => update('priceMax', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
            <input type="number" placeholder="Max Mileage" value={filters.mileageMax} onChange={(e: any) => update('mileageMax', e.target.value)} className={inputClass} style={inputStyle} />
          </div>
        )}
      </div>

      {/* Specs */}
      <div className="mb-3">
        <button className="w-full flex justify-between items-center py-2 text-sm font-semibold" style={{ color: '#e8e8e8', borderBottom: '1px solid rgba(201,162,39,0.2)' }} onClick={() => toggle('specs')}>
          Body & Specs {sections.specs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {sections.specs && (
          <div className="pt-3 space-y-2">
            <select value={filters.bodyStyle} onChange={(e: any) => update('bodyStyle', e.target.value)} className={inputClass} style={inputStyle}>
              <option value="">All Body Styles</option>
              {BODY_STYLES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={filters.transmission} onChange={(e: any) => update('transmission', e.target.value)} className={inputClass} style={inputStyle}>
              <option value="">All Transmissions</option>
              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filters.fuelType} onChange={(e: any) => update('fuelType', e.target.value)} className={inputClass} style={inputStyle}>
              <option value="">All Fuel Types</option>
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <select value={filters.driveType} onChange={(e: any) => update('driveType', e.target.value)} className={inputClass} style={inputStyle}>
              <option value="">All Drive Types</option>
              {DRIVE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="text" placeholder="Location" value={filters.location} onChange={(e: any) => update('location', e.target.value)} className={inputClass} style={inputStyle} />
          </div>
        )}
      </div>

      {/* Condition */}
      <div className="mb-3">
        <button className="w-full flex justify-between items-center py-2 text-sm font-semibold" style={{ color: '#e8e8e8', borderBottom: '1px solid rgba(201,162,39,0.2)' }} onClick={() => toggle('condition')}>
          Condition {sections.condition ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {sections.condition && (
          <div className="pt-3">
            <select value={filters.condition} onChange={(e: any) => update('condition', e.target.value)} className={inputClass} style={inputStyle}>
              <option value="">All Conditions</option>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

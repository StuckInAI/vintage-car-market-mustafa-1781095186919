import { Link } from 'react-router-dom';
import { MapPin, Gauge, Calendar, Tag } from 'lucide-react';
import type { CarListing } from '@/types';
import { formatPrice } from '@/lib/utils';

type CarCardProps = { car: CarListing };

export default function CarCard({ car }: CarCardProps) {
  const carImage = car.images && car.images.length > 0 ? car.images[0] : null;

  return (
    <Link to={`/car/${car.id}`} className="block group">
      <div className="vintage-card rounded-lg overflow-hidden transition-transform duration-200 group-hover:-translate-y-1" style={{ border: '1px solid rgba(201,162,39,0.3)' }}>
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: '200px', backgroundColor: '#111125' }}>
          {carImage ? (
            <img src={carImage} alt={`${car.year} ${car.make} ${car.model}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ backgroundColor: '#111125' }}>
              <svg width="80" height="50" viewBox="0 0 100 60" fill="none">
                <path d="M5 50 L5 30 L20 10 L50 10 L65 20 L90 20 L95 35 L95 50 Z" stroke="#c9a227" strokeWidth="2" fill="none" />
                <circle cx="22" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                <circle cx="75" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
              </svg>
              <span className="text-xs" style={{ color: '#555' }}>No Image Available</span>
            </div>
          )}
          <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: '#1a1a2e', color: '#c9a227', border: '1px solid #c9a227' }}>
            {car.condition}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold mb-1" style={{ color: '#e8e8e8' }}>
            {car.year} {car.make} {car.model}
          </h3>
          {car.trim && <p className="text-sm mb-2" style={{ color: '#a0a0a0' }}>{car.trim}</p>}

          <div className="flex flex-wrap gap-3 mb-3 text-xs" style={{ color: '#a0a0a0' }}>
            <span className="flex items-center gap-1"><Gauge size={12} /> {car.mileage.toLocaleString()} mi</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {car.year}</span>
            <span className="flex items-center gap-1"><MapPin size={12} /> {car.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xl font-bold" style={{ color: '#c9a227' }}>
              {formatPrice(car.price)}
              {car.negotiable && <span className="text-xs ml-1" style={{ color: '#a0a0a0' }}>(OBO)</span>}
            </div>
            <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(201,162,39,0.1)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.3)' }}>
              {car.bodyStyle}
            </span>
          </div>

          <div className="mt-2 text-xs" style={{ color: '#888' }}>
            {car.engineSize} {car.cylinders} · {car.transmission} · {car.driveType}
          </div>
        </div>
      </div>
    </Link>
  );
}

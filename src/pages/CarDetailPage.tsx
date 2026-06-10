import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Gauge, Calendar, Phone, Mail, Tag } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { formatPrice, formatDate } from '@/lib/utils';

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings } = useListings();

  const car = listings.find((c) => c.id === id);

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-xl mb-4" style={{ color: '#a0a0a0' }}>Car listing not found.</p>
        <Link to="/browse" className="text-yellow-400 hover:underline">Back to Browse</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-sm hover:text-yellow-400"
        style={{ color: '#a0a0a0' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {car.images && car.images.length > 0 ? (
            <div className="rounded-lg overflow-hidden" style={{ height: '350px', backgroundColor: '#111125' }}>
              <img src={car.images[0]} alt={`${car.year} ${car.make} ${car.model}`} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="rounded-lg flex flex-col items-center justify-center gap-4" style={{ height: '350px', backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)' }}>
              <svg width="120" height="75" viewBox="0 0 100 60" fill="none">
                <path d="M5 50 L5 30 L20 10 L50 10 L65 20 L90 20 L95 35 L95 50 Z" stroke="#c9a227" strokeWidth="2" fill="none" />
                <circle cx="22" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                <circle cx="75" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
              </svg>
              <span style={{ color: '#555' }}>No Images Available</span>
            </div>
          )}
          {car.images && car.images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {car.images.slice(1).map((img, i) => (
                <img key={i} src={img} alt="" className="w-20 h-16 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
            {car.year} {car.make} {car.model}
          </h1>
          {car.trim && <p className="text-lg mb-3" style={{ color: '#a0a0a0' }}>{car.trim}</p>}

          <div className="text-3xl font-bold mb-4" style={{ color: '#c9a227' }}>
            {formatPrice(car.price)}
            {car.negotiable && <span className="text-base ml-2" style={{ color: '#a0a0a0' }}>(Negotiable)</span>}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: <Gauge size={14} />, label: 'Mileage', value: `${car.mileage.toLocaleString()} mi` },
              { icon: <Calendar size={14} />, label: 'Year', value: car.year },
              { icon: <Tag size={14} />, label: 'Condition', value: car.condition },
              { icon: <MapPin size={14} />, label: 'Location', value: car.location },
            ].map((item) => (
              <div key={item.label} className="rounded p-3" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
                <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#a0a0a0' }}>{item.icon} {item.label}</div>
                <div className="text-sm font-semibold" style={{ color: '#e8e8e8' }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2" style={{ color: '#c9a227' }}>Specifications</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['Engine', `${car.engineSize} ${car.cylinders}`],
                ['Transmission', car.transmission],
                ['Drive Type', car.driveType],
                ['Fuel Type', car.fuelType],
                ['Body Style', car.bodyStyle],
                ['Color', car.color],
                ...(car.interiorColor ? [['Interior', car.interiorColor]] : []),
                ...(car.horsepower ? [['Horsepower', `${car.horsepower} hp`]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1" style={{ borderBottom: '1px solid rgba(201,162,39,0.1)' }}>
                  <span style={{ color: '#a0a0a0' }}>{label}</span>
                  <span style={{ color: '#e8e8e8' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seller */}
          <div className="rounded p-4" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
            <h3 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Contact Seller</h3>
            <p className="font-semibold mb-2" style={{ color: '#e8e8e8' }}>{car.sellerName}</p>
            <div className="flex flex-col gap-2 text-sm">
              <a href={`tel:${car.sellerContact}`} className="flex items-center gap-2 hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
                <Phone size={14} /> {car.sellerContact}
              </a>
              <a href={`mailto:${car.sellerEmail}`} className="flex items-center gap-2 hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
                <Mail size={14} /> {car.sellerEmail}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-3" style={{ color: '#c9a227' }}>Description</h3>
        <p className="leading-relaxed" style={{ color: '#a0a0a0' }}>{car.description}</p>
      </div>

      {/* Features */}
      {car.features && car.features.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-3" style={{ color: '#c9a227' }}>Features</h3>
          <div className="flex flex-wrap gap-2">
            {car.features.map((f) => (
              <span key={f} className="px-3 py-1 rounded text-sm" style={{ backgroundColor: 'rgba(201,162,39,0.1)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.3)' }}>{f}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-xs" style={{ color: '#666' }}>Listed {formatDate(car.createdAt)}</div>
    </div>
  );
}

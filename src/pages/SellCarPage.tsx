import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '@/context/ListingsContext';
import { useAuth } from '@/hooks/useAuth';
import type { CarListing, AuctionListing } from '@/types';
import { CAR_MAKES, BODY_STYLES, TRANSMISSIONS, FUEL_TYPES, DRIVE_TYPES, CONDITIONS } from '@/lib/constants';
import { generateId } from '@/lib/utils';

const INITIAL_FORM = {
  listingType: 'sale' as 'sale' | 'auction',
  make: '',
  model: '',
  year: '',
  trim: '',
  vin: '',
  mileage: '',
  condition: 'Good',
  transmission: 'Manual',
  fuelType: 'Gasoline',
  bodyStyle: 'Coupe',
  driveType: 'RWD',
  engineSize: '',
  cylinders: '',
  horsepower: '',
  color: '',
  interiorColor: '',
  doors: '2',
  features: '',
  price: '',
  negotiable: false,
  description: '',
  location: '',
  sellerName: '',
  sellerContact: '',
  sellerEmail: '',
  reservePrice: '',
  startingBid: '',
  auctionDurationHours: '24',
};

export default function SellCarPage() {
  const navigate = useNavigate();
  const { addListing, addAuction } = useListings();
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.make) e.make = 'Make is required';
    if (!form.model) e.model = 'Model is required';
    if (!form.year || isNaN(Number(form.year))) e.year = 'Valid year is required';
    if (!form.mileage || isNaN(Number(form.mileage))) e.mileage = 'Valid mileage is required';
    if (!form.engineSize) e.engineSize = 'Engine size is required';
    if (!form.cylinders) e.cylinders = 'Cylinders is required';
    if (!form.color) e.color = 'Color is required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price is required';
    if (!form.description) e.description = 'Description is required';
    if (!form.location) e.location = 'Location is required';
    if (!form.sellerName) e.sellerName = 'Seller name is required';
    if (!form.sellerContact) e.sellerContact = 'Contact is required';
    if (!form.sellerEmail) e.sellerEmail = 'Email is required';
    if (form.listingType === 'auction') {
      if (!form.reservePrice || isNaN(Number(form.reservePrice))) e.reservePrice = 'Reserve price is required';
      if (!form.startingBid || isNaN(Number(form.startingBid))) e.startingBid = 'Starting bid is required';
    }
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const base = {
      id: generateId('car'),
      make: form.make,
      model: form.model,
      year: parseInt(form.year),
      trim: form.trim,
      vin: form.vin,
      mileage: parseInt(form.mileage),
      condition: form.condition,
      transmission: form.transmission,
      fuelType: form.fuelType,
      bodyStyle: form.bodyStyle,
      driveType: form.driveType,
      engineSize: form.engineSize,
      cylinders: form.cylinders,
      horsepower: form.horsepower,
      color: form.color,
      interiorColor: form.interiorColor,
      doors: form.doors,
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      price: parseInt(form.price),
      negotiable: form.negotiable,
      description: form.description,
      location: form.location,
      sellerName: form.sellerName,
      sellerContact: form.sellerContact,
      sellerEmail: form.sellerEmail,
      images: [],
      createdAt: Date.now(),
      sellerId: user?.id || 'guest',
    };

    if (form.listingType === 'auction') {
      const durationHours = parseInt(form.auctionDurationHours);
      const auction: AuctionListing = {
        ...base,
        listingType: 'auction',
        reservePrice: parseInt(form.reservePrice),
        startingBid: parseInt(form.startingBid),
        currentBid: parseInt(form.startingBid),
        currentBidder: null,
        currentBidderName: '',
        auctionDurationHours: durationHours,
        auctionEndTime: Date.now() + durationHours * 3600000,
        auctionActive: true,
        bids: [],
      };
      addAuction(auction);
      navigate('/auction');
    } else {
      const listing: CarListing = { ...base, listingType: 'sale' };
      addListing(listing);
      navigate('/browse');
    }
    setSubmitted(true);
  };

  const inputClass = "w-full px-3 py-2 rounded text-sm outline-none";
  const inputStyle = { backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' };
  const errStyle = { color: '#ff6666', fontSize: '11px' };
  const labelStyle = { color: '#a0a0a0', fontSize: '12px' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>List Your Car</h1>
      <p className="mb-8" style={{ color: '#a0a0a0' }}>Fill in the details below to create your listing.</p>

      {!isAuthenticated && (
        <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#2a1a00', border: '1px solid #c9a227' }}>
          <p style={{ color: '#c9a227' }}>You are listing as a guest. <a href="/auth" className="underline">Sign in</a> to manage your listings.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Listing Type */}
        <div className="p-4 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Listing Type</h3>
          <div className="flex gap-4">
            {(['sale', 'auction'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => update('listingType', type)}
                className="px-4 py-2 rounded text-sm font-semibold"
                style={{
                  backgroundColor: form.listingType === type ? '#c9a227' : 'transparent',
                  color: form.listingType === type ? '#1a1a2e' : '#a0a0a0',
                  border: '1px solid #c9a227',
                }}
              >
                {type === 'sale' ? 'For Sale' : 'Auction'}
              </button>
            ))}
          </div>
        </div>

        {/* Car Details */}
        <div className="p-4 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Vehicle Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Make *</label>
              <select value={form.make} onChange={(e) => update('make', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select Make</option>
                {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.make && <span style={errStyle}>{errors.make}</span>}
            </div>
            <div>
              <label style={labelStyle}>Model *</label>
              <input value={form.model} onChange={(e) => update('model', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Mustang" />
              {errors.model && <span style={errStyle}>{errors.model}</span>}
            </div>
            <div>
              <label style={labelStyle}>Year *</label>
              <input type="number" value={form.year} onChange={(e) => update('year', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 1967" />
              {errors.year && <span style={errStyle}>{errors.year}</span>}
            </div>
            <div>
              <label style={labelStyle}>Trim</label>
              <input value={form.trim} onChange={(e) => update('trim', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. GT, Z/28" />
            </div>
            <div>
              <label style={labelStyle}>VIN</label>
              <input value={form.vin} onChange={(e) => update('vin', e.target.value)} className={inputClass} style={inputStyle} placeholder="Vehicle Identification Number" />
            </div>
            <div>
              <label style={labelStyle}>Mileage *</label>
              <input type="number" value={form.mileage} onChange={(e) => update('mileage', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 45000" />
              {errors.mileage && <span style={errStyle}>{errors.mileage}</span>}
            </div>
            <div>
              <label style={labelStyle}>Engine Size *</label>
              <input value={form.engineSize} onChange={(e) => update('engineSize', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 4.7L" />
              {errors.engineSize && <span style={errStyle}>{errors.engineSize}</span>}
            </div>
            <div>
              <label style={labelStyle}>Cylinders *</label>
              <input value={form.cylinders} onChange={(e) => update('cylinders', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. V8, Inline-6" />
              {errors.cylinders && <span style={errStyle}>{errors.cylinders}</span>}
            </div>
            <div>
              <label style={labelStyle}>Horsepower</label>
              <input value={form.horsepower} onChange={(e) => update('horsepower', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 320" />
            </div>
            <div>
              <label style={labelStyle}>Exterior Color *</label>
              <input value={form.color} onChange={(e) => update('color', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Highland Green" />
              {errors.color && <span style={errStyle}>{errors.color}</span>}
            </div>
            <div>
              <label style={labelStyle}>Interior Color</label>
              <input value={form.interiorColor} onChange={(e) => update('interiorColor', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Black" />
            </div>
            <div>
              <label style={labelStyle}>Doors</label>
              <select value={form.doors} onChange={(e) => update('doors', e.target.value)} className={inputClass} style={inputStyle}>
                {['2', '3', '4', '5'].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Body Style</label>
              <select value={form.bodyStyle} onChange={(e) => update('bodyStyle', e.target.value)} className={inputClass} style={inputStyle}>
                {BODY_STYLES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Transmission</label>
              <select value={form.transmission} onChange={(e) => update('transmission', e.target.value)} className={inputClass} style={inputStyle}>
                {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fuel Type</label>
              <select value={form.fuelType} onChange={(e) => update('fuelType', e.target.value)} className={inputClass} style={inputStyle}>
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Drive Type</label>
              <select value={form.driveType} onChange={(e) => update('driveType', e.target.value)} className={inputClass} style={inputStyle}>
                {DRIVE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Condition</label>
              <select value={form.condition} onChange={(e) => update('condition', e.target.value)} className={inputClass} style={inputStyle}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label style={labelStyle}>Features (comma-separated)</label>
            <input value={form.features} onChange={(e) => update('features', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Power Steering, Dual Exhaust, Bucket Seats" />
          </div>
        </div>

        {/* Pricing */}
        <div className="p-4 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>{form.listingType === 'auction' ? 'Estimated Value *' : 'Asking Price *'}</label>
              <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 50000" />
              {errors.price && <span style={errStyle}>{errors.price}</span>}
            </div>
            {form.listingType === 'sale' && (
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="negotiable" checked={form.negotiable} onChange={(e) => update('negotiable', e.target.checked)} />
                <label htmlFor="negotiable" style={{ color: '#a0a0a0' }}>Price Negotiable (OBO)</label>
              </div>
            )}
            {form.listingType === 'auction' && (
              <>
                <div>
                  <label style={labelStyle}>Reserve Price *</label>
                  <input type="number" value={form.reservePrice} onChange={(e) => update('reservePrice', e.target.value)} className={inputClass} style={inputStyle} placeholder="Minimum acceptable bid" />
                  {errors.reservePrice && <span style={errStyle}>{errors.reservePrice}</span>}
                </div>
                <div>
                  <label style={labelStyle}>Starting Bid *</label>
                  <input type="number" value={form.startingBid} onChange={(e) => update('startingBid', e.target.value)} className={inputClass} style={inputStyle} placeholder="Opening bid amount" />
                  {errors.startingBid && <span style={errStyle}>{errors.startingBid}</span>}
                </div>
                <div>
                  <label style={labelStyle}>Auction Duration (hours)</label>
                  <select value={form.auctionDurationHours} onChange={(e) => update('auctionDurationHours', e.target.value)} className={inputClass} style={inputStyle}>
                    {['12', '24', '48', '72', '120', '168'].map((h) => (
                      <option key={h} value={h}>{h} hours</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description & Location */}
        <div className="p-4 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Description & Location</h3>
          <div className="space-y-4">
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={5}
                className={inputClass}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Describe the car's history, restoration work, unique features..."
              />
              {errors.description && <span style={errStyle}>{errors.description}</span>}
            </div>
            <div>
              <label style={labelStyle}>Location *</label>
              <input value={form.location} onChange={(e) => update('location', e.target.value)} className={inputClass} style={inputStyle} placeholder="City, State" />
              {errors.location && <span style={errStyle}>{errors.location}</span>}
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="p-4 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Seller Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Name *</label>
              <input value={form.sellerName} onChange={(e) => update('sellerName', e.target.value)} className={inputClass} style={inputStyle} placeholder="Your name or dealership" />
              {errors.sellerName && <span style={errStyle}>{errors.sellerName}</span>}
            </div>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input value={form.sellerContact} onChange={(e) => update('sellerContact', e.target.value)} className={inputClass} style={inputStyle} placeholder="(555) 000-0000" />
              {errors.sellerContact && <span style={errStyle}>{errors.sellerContact}</span>}
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" value={form.sellerEmail} onChange={(e) => update('sellerEmail', e.target.value)} className={inputClass} style={inputStyle} placeholder="you@example.com" />
              {errors.sellerEmail && <span style={errStyle}>{errors.sellerEmail}</span>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded font-bold text-base tracking-wide"
          style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
        >
          {form.listingType === 'auction' ? 'Create Auction Listing' : 'Create Sale Listing'}
        </button>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Gavel, CheckCircle, AlertCircle } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { useAuth } from '@/hooks/useAuth';
import type { CarListing, AuctionListing } from '@/types';
import { CAR_MAKES, BODY_STYLES, TRANSMISSIONS, FUEL_TYPES, DRIVE_TYPES, CONDITIONS, CYLINDERS, DOOR_OPTIONS } from '@/lib/constants';

const EMPTY_FORM = {
  listingType: 'sale' as 'sale' | 'auction',
  make: '',
  model: '',
  year: '',
  trim: '',
  vin: '',
  mileage: '',
  condition: '',
  transmission: '',
  fuelType: '',
  bodyStyle: '',
  driveType: '',
  engineSize: '',
  cylinders: '',
  horsepower: '',
  color: '',
  interiorColor: '',
  doors: '',
  features: '' as string,
  price: '',
  negotiable: false,
  description: '',
  location: '',
  sellerName: '',
  sellerContact: '',
  sellerEmail: '',
  // Auction fields
  reservePrice: '',
  startingBid: '',
  auctionDurationHours: '24',
};

type FormState = typeof EMPTY_FORM;

export default function SellCarPage() {
  const { addListing, addAuction } = useListings();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    ...EMPTY_FORM,
    sellerName: user?.username || '',
    sellerEmail: user?.email || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.make) errs.make = 'Make is required';
    if (!form.model) errs.model = 'Model is required';
    if (!form.year || isNaN(Number(form.year)) || Number(form.year) < 1885 || Number(form.year) > new Date().getFullYear() + 1)
      errs.year = 'Valid year required';
    if (!form.mileage || isNaN(Number(form.mileage))) errs.mileage = 'Valid mileage required';
    if (!form.condition) errs.condition = 'Condition required';
    if (!form.transmission) errs.transmission = 'Transmission required';
    if (!form.fuelType) errs.fuelType = 'Fuel type required';
    if (!form.bodyStyle) errs.bodyStyle = 'Body style required';
    if (!form.driveType) errs.driveType = 'Drive type required';
    if (!form.engineSize) errs.engineSize = 'Engine size required';
    if (!form.cylinders) errs.cylinders = 'Cylinders required';
    if (!form.color) errs.color = 'Color required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Valid price required';
    if (!form.description || form.description.length < 20) errs.description = 'Description must be at least 20 characters';
    if (!form.location) errs.location = 'Location required';
    if (!form.sellerName) errs.sellerName = 'Seller name required';
    if (!form.sellerContact) errs.sellerContact = 'Contact required';
    if (!form.sellerEmail || !/^[^@]+@[^@]+\.[^@]+$/.test(form.sellerEmail)) errs.sellerEmail = 'Valid email required';
    if (form.listingType === 'auction') {
      if (!form.startingBid || isNaN(Number(form.startingBid)) || Number(form.startingBid) <= 0) errs.startingBid = 'Starting bid required';
      if (!form.reservePrice || isNaN(Number(form.reservePrice)) || Number(form.reservePrice) <= 0) errs.reservePrice = 'Reserve price required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const featuresArr = form.features
      ? form.features.split(',').map((f) => f.trim()).filter(Boolean)
      : [];

    const baseData = {
      make: form.make,
      model: form.model,
      year: Number(form.year),
      trim: form.trim,
      vin: form.vin,
      mileage: Number(form.mileage),
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
      features: featuresArr,
      price: Number(form.price),
      negotiable: form.negotiable,
      description: form.description,
      location: form.location,
      sellerName: form.sellerName,
      sellerContact: form.sellerContact,
      sellerEmail: form.sellerEmail,
      images: [] as string[],
      createdAt: Date.now(),
      sellerId: user?.id || 'guest',
    };

    if (form.listingType === 'auction') {
      const durationHours = Number(form.auctionDurationHours) || 24;
      const auction: AuctionListing = {
        ...baseData,
        id: `auction_${Date.now()}`,
        listingType: 'auction',
        reservePrice: Number(form.reservePrice),
        startingBid: Number(form.startingBid),
        currentBid: Number(form.startingBid),
        currentBidder: null,
        currentBidderName: '',
        auctionDurationHours: durationHours,
        auctionEndTime: Date.now() + durationHours * 3600000,
        auctionActive: true,
        bids: [],
      };
      addAuction(auction);
      setSubmitted(true);
      setTimeout(() => navigate('/auction'), 2000);
    } else {
      const listing: CarListing = {
        ...baseData,
        id: `car_${Date.now()}`,
        listingType: 'sale',
      };
      addListing(listing);
      setSubmitted(true);
      setTimeout(() => navigate(`/car/${listing.id}`), 2000);
    }
  };

  const inputClass = 'w-full px-3 py-2 rounded text-sm outline-none focus:ring-1';
  const inputStyle = { backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' };
  const errorStyle = { color: '#ff6b6b', fontSize: '0.75rem', marginTop: '2px' };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle size={64} className="mx-auto mb-4" style={{ color: '#44ff44' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#c9a227' }}>Listing Submitted!</h2>
        <p style={{ color: '#a0a0a0' }}>Your {form.listingType === 'auction' ? 'auction' : 'listing'} has been created. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>List Your Car</h1>
      <p className="text-sm mb-6" style={{ color: '#a0a0a0' }}>Fill in the details below to create your listing.</p>

      {/* Listing Type */}
      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => update('listingType', 'sale')}
          className="flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm"
          style={{
            backgroundColor: form.listingType === 'sale' ? '#c9a227' : 'transparent',
            color: form.listingType === 'sale' ? '#1a1a2e' : '#c9a227',
            border: '1px solid #c9a227',
          }}
        >
          <Car size={16} /> Fixed Price Sale
        </button>
        <button
          type="button"
          onClick={() => update('listingType', 'auction')}
          className="flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm"
          style={{
            backgroundColor: form.listingType === 'auction' ? '#c9a227' : 'transparent',
            color: form.listingType === 'auction' ? '#1a1a2e' : '#c9a227',
            border: '1px solid #c9a227',
          }}
        >
          <Gavel size={16} /> Auction
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Info */}
        <section className="rounded-lg p-5" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#c9a227' }}>Vehicle Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Make *</label>
              <select value={form.make} onChange={(e) => update('make', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select Make</option>
                {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.make && <p style={errorStyle}>{errors.make}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Model *</label>
              <input type="text" value={form.model} onChange={(e) => update('model', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Mustang" />
              {errors.model && <p style={errorStyle}>{errors.model}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Year *</label>
              <input type="number" value={form.year} onChange={(e) => update('year', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 1967" />
              {errors.year && <p style={errorStyle}>{errors.year}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Trim</label>
              <input type="text" value={form.trim} onChange={(e) => update('trim', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Fastback" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>VIN</label>
              <input type="text" value={form.vin} onChange={(e) => update('vin', e.target.value)} className={inputClass} style={inputStyle} placeholder="Vehicle Identification Number" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Mileage *</label>
              <input type="number" value={form.mileage} onChange={(e) => update('mileage', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 45000" />
              {errors.mileage && <p style={errorStyle}>{errors.mileage}</p>}
            </div>
          </div>
        </section>

        {/* Specs */}
        <section className="rounded-lg p-5" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#c9a227' }}>Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Condition *</label>
              <select value={form.condition} onChange={(e) => update('condition', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select Condition</option>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.condition && <p style={errorStyle}>{errors.condition}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Body Style *</label>
              <select value={form.bodyStyle} onChange={(e) => update('bodyStyle', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select Body Style</option>
                {BODY_STYLES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.bodyStyle && <p style={errorStyle}>{errors.bodyStyle}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Transmission *</label>
              <select value={form.transmission} onChange={(e) => update('transmission', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select Transmission</option>
                {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.transmission && <p style={errorStyle}>{errors.transmission}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Fuel Type *</label>
              <select value={form.fuelType} onChange={(e) => update('fuelType', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select Fuel Type</option>
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              {errors.fuelType && <p style={errorStyle}>{errors.fuelType}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Drive Type *</label>
              <select value={form.driveType} onChange={(e) => update('driveType', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select Drive Type</option>
                {DRIVE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.driveType && <p style={errorStyle}>{errors.driveType}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Engine Size *</label>
              <input type="text" value={form.engineSize} onChange={(e) => update('engineSize', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 4.7L" />
              {errors.engineSize && <p style={errorStyle}>{errors.engineSize}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Cylinders *</label>
              <select value={form.cylinders} onChange={(e) => update('cylinders', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select</option>
                {CYLINDERS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.cylinders && <p style={errorStyle}>{errors.cylinders}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Horsepower</label>
              <input type="number" value={form.horsepower} onChange={(e) => update('horsepower', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 320" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Exterior Color *</label>
              <input type="text" value={form.color} onChange={(e) => update('color', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Highland Green" />
              {errors.color && <p style={errorStyle}>{errors.color}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Interior Color</label>
              <input type="text" value={form.interiorColor} onChange={(e) => update('interiorColor', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Black" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Doors</label>
              <select value={form.doors} onChange={(e) => update('doors', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select</option>
                {DOOR_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="rounded-lg p-5" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#c9a227' }}>Features & Description</h2>
          <div className="mb-4">
            <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Features (comma-separated)</label>
            <input
              type="text"
              value={form.features}
              onChange={(e) => update('features', e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. Power Steering, Dual Exhaust, Bucket Seats"
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Description * (min 20 chars)</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className={inputClass}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              placeholder="Describe the car's history, condition, restoration work, etc."
            />
            {errors.description && <p style={errorStyle}>{errors.description}</p>}
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-lg p-5" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#c9a227' }}>Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>{form.listingType === 'auction' ? 'Estimated Value ($) *' : 'Asking Price ($) *'}</label>
              <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 89000" />
              {errors.price && <p style={errorStyle}>{errors.price}</p>}
            </div>
            {form.listingType === 'sale' && (
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={form.negotiable}
                  onChange={(e) => update('negotiable', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="negotiable" className="text-sm" style={{ color: '#e8e8e8' }}>Price is negotiable (OBO)</label>
              </div>
            )}
            {form.listingType === 'auction' && (
              <>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Starting Bid ($) *</label>
                  <input type="number" value={form.startingBid} onChange={(e) => update('startingBid', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 50000" />
                  {errors.startingBid && <p style={errorStyle}>{errors.startingBid}</p>}
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Reserve Price ($) *</label>
                  <input type="number" value={form.reservePrice} onChange={(e) => update('reservePrice', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 75000" />
                  {errors.reservePrice && <p style={errorStyle}>{errors.reservePrice}</p>}
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Auction Duration</label>
                  <select value={form.auctionDurationHours} onChange={(e) => update('auctionDurationHours', e.target.value)} className={inputClass} style={inputStyle}>
                    <option value="24">24 Hours</option>
                    <option value="48">48 Hours</option>
                    <option value="72">72 Hours</option>
                    <option value="168">7 Days</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Location & Contact */}
        <section className="rounded-lg p-5" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#c9a227' }}>Location & Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Location *</label>
              <input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Los Angeles, CA" />
              {errors.location && <p style={errorStyle}>{errors.location}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Your Name *</label>
              <input type="text" value={form.sellerName} onChange={(e) => update('sellerName', e.target.value)} className={inputClass} style={inputStyle} placeholder="Full name" />
              {errors.sellerName && <p style={errorStyle}>{errors.sellerName}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Phone / Contact *</label>
              <input type="text" value={form.sellerContact} onChange={(e) => update('sellerContact', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. (310) 555-0198" />
              {errors.sellerContact && <p style={errorStyle}>{errors.sellerContact}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs mb-1" style={{ color: '#a0a0a0' }}>Email *</label>
              <input type="email" value={form.sellerEmail} onChange={(e) => update('sellerEmail', e.target.value)} className={inputClass} style={inputStyle} placeholder="your@email.com" />
              {errors.sellerEmail && <p style={errorStyle}>{errors.sellerEmail}</p>}
            </div>
          </div>
        </section>

        {Object.keys(errors).length > 0 && (
          <div className="flex items-center gap-2 p-3 rounded" style={{ backgroundColor: 'rgba(139,26,26,0.3)', border: '1px solid #8b1a1a' }}>
            <AlertCircle size={16} style={{ color: '#ff6b6b' }} />
            <span className="text-sm" style={{ color: '#ff6b6b' }}>Please fix the errors above before submitting.</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded font-bold text-base transition-colors"
          style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
        >
          {form.listingType === 'auction' ? 'Create Auction Listing' : 'Create Sale Listing'}
        </button>
      </form>
    </div>
  );
}

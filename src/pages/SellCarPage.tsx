import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { useAuth } from '@/hooks/useAuth';
import type { CarListing } from '@/types';
import {
  CAR_MAKES, BODY_STYLES, TRANSMISSIONS, FUEL_TYPES, DRIVE_TYPES,
  CONDITIONS, CYLINDER_OPTIONS, DOOR_OPTIONS, EXTERIOR_COLORS,
  INTERIOR_COLORS, CAR_FEATURES
} from '@/lib/constants';
import { generateId } from '@/lib/utils';

type CarCondition = CarListing['condition'];
type CarTransmission = CarListing['transmission'];
type CarFuelType = CarListing['fuelType'];
type CarBodyStyle = CarListing['bodyStyle'];
type CarDriveType = CarListing['driveType'];

type FormData = {
  make: string;
  model: string;
  year: number;
  trim: string;
  vin: string;
  mileage: number;
  condition: CarCondition;
  transmission: CarTransmission;
  fuelType: CarFuelType;
  bodyStyle: CarBodyStyle;
  driveType: CarDriveType;
  engineSize: string;
  cylinders: string;
  horsepower: number;
  color: string;
  exteriorColor: string;
  interiorColor: string;
  doors: string;
  features: string[];
  price: number;
  negotiable: boolean;
  description: string;
  location: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  images: string[];
  title: string;
};

const defaultForm: FormData = {
  make: '',
  model: '',
  year: 1965,
  trim: '',
  vin: '',
  mileage: 0,
  condition: 'Good',
  transmission: 'Manual',
  fuelType: 'Gasoline',
  bodyStyle: 'Sedan',
  driveType: 'RWD',
  engineSize: '',
  cylinders: '',
  horsepower: 0,
  color: '',
  exteriorColor: '',
  interiorColor: '',
  doors: '2',
  features: [],
  price: 0,
  negotiable: false,
  description: '',
  location: '',
  sellerName: '',
  sellerPhone: '',
  sellerEmail: '',
  images: [],
  title: '',
};

export default function SellCarPage() {
  const navigate = useNavigate();
  const { addListing } = useListings();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = () => {
    const title = form.title || `${form.year} ${form.make} ${form.model}`;
    const listing: CarListing = {
      id: generateId('car'),
      listingType: 'sale',
      make: form.make,
      model: form.model,
      year: form.year,
      trim: form.trim,
      vin: form.vin,
      mileage: form.mileage,
      condition: form.condition,
      transmission: form.transmission,
      fuelType: form.fuelType,
      bodyStyle: form.bodyStyle,
      driveType: form.driveType,
      engineSize: form.engineSize,
      cylinders: form.cylinders,
      horsepower: form.horsepower.toString(),
      color: form.exteriorColor || form.color,
      interiorColor: form.interiorColor,
      doors: form.doors,
      features: form.features,
      price: form.price,
      negotiable: form.negotiable,
      description: form.description,
      location: form.location,
      sellerName: form.sellerName,
      sellerContact: form.sellerPhone,
      sellerEmail: form.sellerEmail,
      images: form.images,
      createdAt: Date.now(),
      sellerId: user?.id || 'anonymous',
    };
    addListing(listing);
    setSubmitted(true);
  };

  const inputClass = 'w-full px-3 py-2 rounded text-sm outline-none focus:ring-1';
  const inputStyle = { backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' };
  const labelClass = 'block text-sm font-semibold mb-1';
  const labelStyle = { color: '#c9a227' };

  const totalSteps = 4;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle2 size={64} className="mx-auto mb-4" style={{ color: '#44ff44' }} />
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>Listing Submitted!</h2>
        <p className="mb-8" style={{ color: '#a0a0a0' }}>Your vehicle has been listed on VCCP. Buyers can now contact you directly.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/browse')}
            className="px-6 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
          >View Listings</button>
          <button
            onClick={() => { setSubmitted(false); setStep(1); setForm(defaultForm); }}
            className="px-6 py-3 rounded-lg font-semibold border"
            style={{ borderColor: '#C9A84C', color: '#C9A84C' }}
          >List Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>List Your Classic Car</h1>
      <p className="text-sm mb-6" style={{ color: '#a0a0a0' }}>Step {step} of {totalSteps}</p>

      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex-1 h-1 rounded" style={{ backgroundColor: i < step ? '#c9a227' : '#333' }} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e8e8e8' }}>Basic Information</h2>

          <div>
            <label className={labelClass} style={labelStyle}>Listing Title (optional)</label>
            <input className={inputClass} style={inputStyle} placeholder={`${form.year} ${form.make} ${form.model}`} value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Make *</label>
              <select className={inputClass} style={inputStyle} value={form.make} onChange={e => set('make', e.target.value as string)}>
                <option value="">Select Make</option>
                {CAR_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Model *</label>
              <input className={inputClass} style={inputStyle} placeholder="e.g. Mustang" value={form.model} onChange={e => set('model', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Year *</label>
              <input type="number" className={inputClass} style={inputStyle} value={form.year} onChange={e => set('year', parseInt(e.target.value) || 1965)} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Trim</label>
              <input className={inputClass} style={inputStyle} placeholder="e.g. Fastback" value={form.trim} onChange={e => set('trim', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Mileage *</label>
              <input type="number" className={inputClass} style={inputStyle} value={form.mileage} onChange={e => set('mileage', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>VIN</label>
              <input className={inputClass} style={inputStyle} placeholder="Vehicle Identification Number" value={form.vin} onChange={e => set('vin', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Location *</label>
            <input className={inputClass} style={inputStyle} placeholder="City, State" value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e8e8e8' }}>Vehicle Specifications</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Condition *</label>
              <select className={inputClass} style={inputStyle} value={form.condition} onChange={e => set('condition', e.target.value as CarCondition)}>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Body Style *</label>
              <select className={inputClass} style={inputStyle} value={form.bodyStyle} onChange={e => set('bodyStyle', e.target.value as CarBodyStyle)}>
                {BODY_STYLES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Transmission *</label>
              <select className={inputClass} style={inputStyle} value={form.transmission} onChange={e => set('transmission', e.target.value as CarTransmission)}>
                {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Fuel Type *</label>
              <select className={inputClass} style={inputStyle} value={form.fuelType} onChange={e => set('fuelType', e.target.value as CarFuelType)}>
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Drive Type *</label>
              <select className={inputClass} style={inputStyle} value={form.driveType} onChange={e => set('driveType', e.target.value as CarDriveType)}>
                {DRIVE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Doors</label>
              <select className={inputClass} style={inputStyle} value={form.doors} onChange={e => set('doors', e.target.value)}>
                {DOOR_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Engine Size</label>
              <input className={inputClass} style={inputStyle} placeholder="e.g. 4.7L" value={form.engineSize} onChange={e => set('engineSize', e.target.value)} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Cylinders</label>
              <select className={inputClass} style={inputStyle} value={form.cylinders} onChange={e => set('cylinders', e.target.value)}>
                <option value="">Select</option>
                {CYLINDER_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Exterior Color</label>
              <input className={inputClass} style={inputStyle} placeholder="e.g. Highland Green" value={form.exteriorColor} onChange={e => set('exteriorColor', e.target.value)} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Interior Color</label>
              <input className={inputClass} style={inputStyle} placeholder="e.g. Black" value={form.interiorColor} onChange={e => set('interiorColor', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Horsepower</label>
            <input type="number" className={inputClass} style={inputStyle} value={form.horsepower} onChange={e => set('horsepower', parseInt(e.target.value) || 0)} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e8e8e8' }}>Description & Features</h2>

          <div>
            <label className={labelClass} style={labelStyle}>Price (USD) *</label>
            <input type="number" className={inputClass} style={inputStyle} value={form.price} onChange={e => set('price', parseInt(e.target.value) || 0)} />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="negotiable" checked={form.negotiable} onChange={e => set('negotiable', e.target.checked)} />
            <label htmlFor="negotiable" className="text-sm" style={{ color: '#e8e8e8' }}>Price is negotiable</label>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Description *</label>
            <textarea
              className={inputClass}
              style={{ ...inputStyle, minHeight: '120px' }}
              placeholder="Describe the vehicle's history, condition, modifications, etc."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Features & Options</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {CAR_FEATURES.map(feature => (
                <label key={feature} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#e8e8e8' }}>
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                    style={{ accentColor: '#c9a227' }}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e8e8e8' }}>Contact Information</h2>

          <div>
            <label className={labelClass} style={labelStyle}>Your Name *</label>
            <input className={inputClass} style={inputStyle} placeholder="Full Name" value={form.sellerName} onChange={e => set('sellerName', e.target.value)} />
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Phone Number</label>
            <input className={inputClass} style={inputStyle} placeholder="(555) 000-0000" value={form.sellerPhone} onChange={e => set('sellerPhone', e.target.value)} />
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Email Address *</label>
            <input className={inputClass} style={inputStyle} placeholder="your@email.com" value={form.sellerEmail} onChange={e => set('sellerEmail', e.target.value)} />
          </div>

          <div className="mt-6 p-4 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
            <h3 className="font-bold mb-3" style={{ color: '#c9a227' }}>Review Your Listing</h3>
            <div className="text-sm space-y-1" style={{ color: '#a0a0a0' }}>
              <p><span style={{ color: '#e8e8e8' }}>Vehicle:</span> {form.year} {form.make} {form.model} {form.trim}</p>
              <p><span style={{ color: '#e8e8e8' }}>Condition:</span> {form.condition}</p>
              <p><span style={{ color: '#e8e8e8' }}>Mileage:</span> {form.mileage.toLocaleString()} mi</p>
              <p><span style={{ color: '#e8e8e8' }}>Price:</span> ${form.price.toLocaleString()}{form.negotiable ? ' (OBO)' : ''}</p>
              <p><span style={{ color: '#e8e8e8' }}>Location:</span> {form.location}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 px-5 py-2 rounded font-semibold"
            style={{ border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227' }}
          >
            <ChevronLeft size={16} /> Back
          </button>
        ) : <div />}

        {step < totalSteps ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-5 py-2 rounded font-semibold"
            style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 rounded font-bold"
            style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
          >
            <CheckCircle2 size={16} /> Submit Listing
          </button>
        )}
      </div>
    </div>
  );
}

export type CarCondition = 'Excellent' | 'Good' | 'Fair' | 'Project';
export type TransmissionType = 'Manual' | 'Automatic' | 'Semi-Automatic';
export type FuelType = 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'Other';
export type BodyStyle = 'Sedan' | 'Coupe' | 'Convertible' | 'Roadster' | 'SUV' | 'Truck' | 'Wagon' | 'Van' | 'Other';
export type DriveType = 'RWD' | 'FWD' | 'AWD' | '4WD';
export type ListingType = 'sale' | 'auction';

export interface CarListing {
  id: string;
  listingType: ListingType;
  // Basic Info
  make: string;
  model: string;
  year: number;
  trim: string;
  vin: string;
  // Specs
  mileage: number;
  condition: CarCondition;
  transmission: TransmissionType;
  fuelType: FuelType;
  bodyStyle: BodyStyle;
  driveType: DriveType;
  engineSize: string;
  cylinders: string;
  horsepower: string;
  color: string;
  interiorColor: string;
  doors: string;
  // Features
  features: string[];
  // Pricing
  price: number;
  negotiable: boolean;
  // Details
  description: string;
  location: string;
  sellerName: string;
  sellerContact: string;
  sellerEmail: string;
  images: string[];
  createdAt: number;
  // Seller auth
  sellerId: string;
}

export interface AuctionListing extends CarListing {
  listingType: 'auction';
  reservePrice: number;
  startingBid: number;
  currentBid: number;
  currentBidder: string;
  currentBidderName: string;
  auctionDurationHours: number;
  auctionEndTime: number;
  auctionActive: boolean;
  bids: Bid[];
}

export interface Bid {
  id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'seller' | 'bidder' | 'both';
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type FilterState = {
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  mileageMax: string;
  condition: string;
  bodyStyle: string;
  transmission: string;
  fuelType: string;
  driveType: string;
  color: string;
  location: string;
  searchText: string;
};

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller' | 'both';
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Bid {
  id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: number;
}

export interface BaseListing {
  id: string;
  listingType: 'sale' | 'auction';
  make: string;
  model: string;
  year: number;
  trim?: string;
  vin?: string;
  mileage: number;
  condition: string;
  transmission: string;
  fuelType: string;
  bodyStyle: string;
  driveType: string;
  engineSize: string;
  cylinders: string;
  horsepower?: string;
  color: string;
  interiorColor?: string;
  doors?: string;
  features: string[];
  price: number;
  negotiable: boolean;
  description: string;
  location: string;
  sellerName: string;
  sellerContact: string;
  sellerEmail: string;
  images: string[];
  createdAt: number;
  sellerId: string;
}

export interface CarListing extends BaseListing {
  listingType: 'sale';
}

export interface AuctionListing extends BaseListing {
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

export interface FilterState {
  searchText: string;
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  mileageMax: string;
  bodyStyle: string;
  transmission: string;
  fuelType: string;
  driveType: string;
  condition: string;
  location: string;
}

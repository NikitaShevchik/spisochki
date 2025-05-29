export interface Country {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  countryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  locationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Place {
  id: string
  name: string
  description?: string
  address?: string
  instagram?: string
  categoryId: string
  visited: boolean
  photos: string[]
  createdAt: Date
  updatedAt: Date
}

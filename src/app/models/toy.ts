
export interface Toy {
  id?: number;  //lokalni id
  toyId?: number;  // alternativni id sa apija
  name: string;
  description: string;
  type: string | { id: number; name: string };
  ageGroup: string | { id: number; name: string };
  targetGroup: 'svi' | 'dečak' | 'devojčica';
  productionDate: string;
  price: number;
  imageUrl: string;
  status?: 'rezervisano' | 'pristiglo' | 'otkazano';
  userRating?: number;
  reviews: Review[];
  permalink?: string;
  uniqueKey?: string;
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ToyFilter {
  name?: string;
  description?: string;
  type?: string;
  ageGroup?: string;
  targetGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}
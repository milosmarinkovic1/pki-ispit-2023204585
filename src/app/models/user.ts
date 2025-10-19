import { Toy } from './toy'; 
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  favoriteToyTypes: string[]; 
  username: string;
  password: string;
  isLoggedIn: boolean;
}

export interface CartItem {
  toy: Toy; // iz toy.ts
  quantity: number;
  reservationDate: string;
}
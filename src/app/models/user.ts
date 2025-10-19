import { Toy } from './toy'; // DODAJ OVO

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  favoriteToyTypes: string[]; // OVO TREBA DA POSTOJI
  username: string;
  password: string;
  isLoggedIn: boolean;
}

export interface CartItem {
  toy: Toy;
  quantity: number;
  reservationDate: string;
}
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({  //ovo je DI ,označava da se ova klasa može koristiti kao servis 
  providedIn: 'root'
})

export class UserService {
  private currentUser: User | null = null;
  
  private users: User[] = [
    {
      id: 1,
      firstName: 'Marko',
      lastName: 'Marković',
      email: 'marko@example.com',
      phone: '011123456',
      address: 'Beograd, Srbija',
      favoriteToyTypes: ['slagalica'],
      username: 'aa',
      password: 'aa',
      isLoggedIn: false
    },
     {
      id: 2,
      firstName: 'Marko2',
      lastName: 'Marković2',
      email: 'marko2@example.com',
      phone: '011123456',
      address: 'Beograd, Srbija',
      favoriteToyTypes: ['figura'],
      username: 'bb',
      password: 'bb',
      isLoggedIn: false
    }



  ];

  constructor() { }

  login(username: string, password: string): boolean {
  const user = this.users.find(u => u.username === username && u.password === password);
  
  if (user) {
    user.isLoggedIn = true;
    this.currentUser = user;
    
    
    this.resetCartStatus();
    
    return true;
  }
  
  return false;
}

  getCartKey(): string {
    if (this.currentUser) {
      return `toyShopCart_${this.currentUser.id}`; 
    }
    return 'toyShopCart_guest'; 
  }

  clearUserCart(): void {
    if (this.currentUser) {
      localStorage.removeItem(this.getCartKey());
    }
  }



private resetCartStatus(): void {
  const savedCart = localStorage.getItem('toyShopCart');
  
  if (savedCart) {
    try {
      const cartItems = JSON.parse(savedCart);  //parsira string u objekat
      const resetCart = cartItems.map((item: any) => ({// mapira kroz sve i menja im status
        ...item,  // kopira sve postojeće property-e 
        status: 'rezervisano'  // menja status
      }));
      
      localStorage.setItem('toyShopCart', JSON.stringify(resetCart));//sejvuje azuriranu korpu
      console.log('Statusi resetovani pri login-u');
      
    } catch (error) {
      console.error('Greška pri resetovanju statusa:', error);
    }
  }
}

  logout(): void {
    if (this.currentUser) {
      this.currentUser.isLoggedIn = false;
    }
    this.currentUser = null;
  }

  register(userData: User): boolean {
    if (this.users.find(u => u.username === userData.username)) {
      alert('Korisničko ime već postoji!');
      return false;
    }
    
    if (this.users.find(u => u.email === userData.email)) {
      alert('Email adresa već postoji!');
      return false;
    }
    
    userData.id = this.users.length + 1; // pravim novi id
    userData.isLoggedIn = true; // menjam polje
    this.users.push(userData);
    this.currentUser = userData;
    
    return true;
  }

  updateProfile(updatedUser: User): boolean {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
      this.users[index] = updatedUser; // zamenjujem starog korisnika sa azuriranim
      
      
      if (this.currentUser && this.currentUser.id === updatedUser.id) {
        // ako je azurirani korisnik prijavljen , azuriram i current user
        this.currentUser = updatedUser;
      }
      
      return true;
    }
    
    return false;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
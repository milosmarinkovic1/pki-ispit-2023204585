import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Toy, ToyFilter, Review } from '../models/toy'; 
import { AgeGroup } from '../models/age-group';

@Injectable({
  providedIn: 'root'
})
export class ToyService {
  

  private baseUrl = 'https://toy.pequla.com/api';
  private toys: Toy[] = [];
  private cartItems: Toy[] = [];
  private toysSubject = new BehaviorSubject<Toy[]>([]);
  private localReviews: Map<number, Review[]> = new Map(); 

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
    this.loadInitialToys();
  }

  private loadInitialToys(): void {
    this.getAllToys().subscribe();
  }





  getAllToys(): Observable<Toy[]> {
    return this.http.get<Toy[]>(`${this.baseUrl}/toy`).pipe(
      map(apiToys => {
        
        this.toys = apiToys.map(apiToy => {
          const toyId = apiToy.toyId || apiToy.id;
          
         
          const finalToy: Toy = {
            ...apiToy,
            id: toyId || this.generateUniqueId(),
            reviews: this.localReviews.get(toyId!) || apiToy.reviews || []
          };
          
          return finalToy;
        });
        
        this.toysSubject.next([...this.toys]);  // Emituje nove podatke
        return this.toys;
      }),
      catchError(error => {
        console.error('Greška pri dobavljanju igračaka:', error);
        return of([]);
      })
    );
  }

  rateToy(toyId: number, rating: number, comment: string, userName: string): void {
  console.log('Dodavanje ocene za igračku ID:', toyId);
  
  const newReview: Review = {
    id: Date.now(), //pravim jedinstveni id
    userName: userName,
    rating: rating,
    comment: comment,
    date: new Date().toISOString()
  };

  // azuriram u glavnoj listi za igrcke 
  const toyIndexInMainList = this.toys.findIndex(t => t.id === toyId);
  if (toyIndexInMainList !== -1) {
    if (!this.toys[toyIndexInMainList].reviews) {
      this.toys[toyIndexInMainList].reviews = [];
    }
    
    // Provera da li korisnik vec ima ocenu 
    const existingReviewIndex = this.toys[toyIndexInMainList].reviews.findIndex(
      r => r.userName === userName
    );
    
    if (existingReviewIndex !== -1) { // azurira ocenu koju sam vec stavio
      
      this.toys[toyIndexInMainList].reviews[existingReviewIndex] = newReview;
    } else {
      
      this.toys[toyIndexInMainList].reviews.push(newReview); // dodajem novu ocenu
    }
    
    console.log('Ocena dodata u glavnu listu:', this.toys[toyIndexInMainList].reviews);
    
    
    this.toysSubject.next([...this.toys]);
  }

  
  const cartIndex = this.cartItems.findIndex(t => t.id === toyId);
  if (cartIndex !== -1) {
    if (!this.cartItems[cartIndex].reviews) {
      this.cartItems[cartIndex].reviews = [];
    }
    
   
    const existingReviewIndex = this.cartItems[cartIndex].reviews.findIndex(
      r => r.userName === userName
    );
    
    if (existingReviewIndex !== -1) {
      
      this.cartItems[cartIndex].reviews[existingReviewIndex] = newReview;
    } else {
     
      this.cartItems[cartIndex].reviews.push(newReview);
    }
    
    this.saveCartToStorage();
    console.log('Ocena dodata u korpu:', this.cartItems[cartIndex].reviews);
  }

 
  if (!this.localReviews.has(toyId)) {
    this.localReviews.set(toyId, []);
  }
  
  const localReviews = this.localReviews.get(toyId)!;
  const existingLocalReviewIndex = localReviews.findIndex(r => r.userName === userName);
  
  if (existingLocalReviewIndex !== -1) {
    localReviews[existingLocalReviewIndex] = newReview;
  } else {
    localReviews.push(newReview);
  }
  
  console.log('Sve ocene za igračku', toyId, ':', {
    glavnaLista: this.toys.find(t => t.id === toyId)?.reviews,
    korpa: this.cartItems.find(t => t.id === toyId)?.reviews,
    lokalne: this.localReviews.get(toyId)
  });
}

 
  getToyById(id: number): Observable<Toy> {
    return this.http.get<Toy>(`${this.baseUrl}/toy/${id}`).pipe(
      map(toy => ({
        ...toy,
        id: toy.toyId || toy.id || this.generateUniqueId(),
        reviews: this.localReviews.get(toy.toyId!) || toy.reviews || []
      })),
      catchError(error => {
        console.error(`Greška pri dobavljanju igračke sa ID ${id}:`, error);
        return of({} as Toy);
      })
    );
  }

  
  getToysObservable(): Observable<Toy[]> {
    return this.toysSubject.asObservable();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('toyShopCart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        console.log('Učitana korpa iz localStorage:', this.cartItems);
      } catch (error) {
        console.error('Greška pri učitavanju korpe:', error);
        this.cartItems = [];
      }
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('toyShopCart', JSON.stringify(this.cartItems));
  }

  

  

  getAgeGroups(): Observable<AgeGroup[]> {
    return this.http.get<AgeGroup[]>(`${this.baseUrl}/age-group`).pipe(
      catchError(error => {
        console.error('Greška pri dobavljanju starosnih grupa:', error);
        return of([]);
      })
    );
  }

  getToyTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/type`).pipe(
      catchError(error => {
        console.error('Greška pri dobavljanju tipova igračaka:', error);
        return of([]);
      })
    );
  }

  searchToys(filter: ToyFilter): Observable<Toy[]> {
    return this.getAllToys().pipe(
      map(toys => {
        return toys.filter(toy => {
          if (filter.name && !toy.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
          }
          
           // Filter po tipu (ručno parsiranje objekta/stringa)
          if (filter.type) {
            let toyType: string;
            
            if (typeof toy.type === 'string') {
              toyType = toy.type;
            } 
            else if (toy.type && typeof toy.type === 'object' && 'name' in toy.type) {
              toyType = (toy.type as any).name;
            }
            else {
              toyType = '';
            }
            
            if (toyType !== filter.type) {
              return false;
            }
          }
          
          if (filter.ageGroup) {
            let toyAgeGroup: string;
            
            if (typeof toy.ageGroup === 'string') {
              toyAgeGroup = toy.ageGroup;
            } 
            else if (toy.ageGroup && typeof toy.ageGroup === 'object' && 'name' in toy.ageGroup) {
              toyAgeGroup = (toy.ageGroup as any).name;
            }
            else {
              toyAgeGroup = '';
            }
            
            if (toyAgeGroup !== filter.ageGroup) {
              return false;
            }
          }
          
          if (filter.targetGroup && toy.targetGroup !== filter.targetGroup) {
            return false;
          }
          
          if (filter.minPrice && toy.price < filter.minPrice) return false;
          if (filter.maxPrice && toy.price > filter.maxPrice) return false;
          
          return true;
        });
      })
    );
  }

 reserveToy(toy: Toy): boolean {
  console.log('Pokušaj rezervacije:', toy.name, 'ID:', toy.id);
  
  // provera dal vec postoji u korpi
  const existingItemIndex = this.cartItems.findIndex(item => item.id === toy.id);
  
  if (existingItemIndex !== -1) {
    alert('Ova igračka je već u vašoj korpi!');
    return false;
  }
  
  
  const toyToAdd = {
    ...toy,
    status: 'rezervisano' as 'rezervisano'
  };
  
  this.cartItems.push(toyToAdd);
  this.saveCartToStorage();
  
  console.log('Igračka uspešno dodata:', toyToAdd.name);
  console.log('Ukupno u korpi:', this.cartItems.length);
  
  alert(`Uspešno ste rezervisali igračku: ${toy.name}`);
  return true;
}

  removeFromCart(toyId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== toyId);
    this.saveCartToStorage();
  }

  updateToyInCart(updatedToy: Toy): void {
    const index = this.cartItems.findIndex(item => item.id === updatedToy.id);
    if (index !== -1) {
      this.cartItems[index] = updatedToy;
      this.saveCartToStorage();
    }
  }

  getCartItems(): Toy[] {
    return [...this.cartItems];// Vraća kopiju 
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }


  private generateUniqueId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  
  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('toyShopCart');
    console.log('Korpa očišćena');
  }

  /*
  debugCart(): void {
    console.log('=== DEBUG KORPA ===');
    console.log('Broj stavki:', this.cartItems.length);
    console.log('Stavke:', this.cartItems.map(item => ({ 
      id: item.id, 
      toyId: item.toyId, 
      name: item.name 
    })));
    console.log('==================');
  }
*/


getAverageRating(toy: Toy): number {
  if (!toy.reviews || toy.reviews.length === 0) {
    return 0;
  }
  
  const sum = toy.reviews.reduce((total, review) => total + review.rating, 0);
  const average = sum / toy.reviews.length;
  return Math.round(average * 10) / 10; 
}


}
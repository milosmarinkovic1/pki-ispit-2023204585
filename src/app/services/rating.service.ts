import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Review } from '../models/toy'; // ISPRAVLJENA

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private ratings = new BehaviorSubject<{[toyId: number]: Review[]}>({});
  
  // ... ostale metode ...


  // Dodaj recenziju
  addRating(toyId: number, review: Review): void {
    const currentRatings = this.ratings.getValue();
    const toyRatings = currentRatings[toyId] || [];
    
    // Proveri da li korisnik već ocenio ovu igračku
    const existingReviewIndex = toyRatings.findIndex(r => r.userName === review.userName);
    
    if (existingReviewIndex !== -1) {
      // Ažuriraj postojeću ocenu
      toyRatings[existingReviewIndex] = review;
    } else {
      // Dodaj novu ocenu
      toyRatings.push(review);
    }
    
    currentRatings[toyId] = toyRatings;
    this.ratings.next(currentRatings);
  }
  
  // Dobavi ocene za igračku
  getRatings(toyId: number): Review[] {
    return this.ratings.getValue()[toyId] || [];
  }
  
  // Izračunaj prosečnu ocenu
  getAverageRating(toyId: number): number {
    const ratings = this.getRatings(toyId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((total, review) => total + review.rating, 0);
    return sum / ratings.length;
  }
  
  // Dobavi broj recenzija
  getRatingCount(toyId: number): number {
    return this.getRatings(toyId).length;
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Review } from '../models/toy'; 
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private ratings = new BehaviorSubject<{[toyId: number]: Review[]}>({});
  
 


  
  addRating(toyId: number, review: Review): void {
    const currentRatings = this.ratings.getValue();
    const toyRatings = currentRatings[toyId] || [];
    
    
    const existingReviewIndex = toyRatings.findIndex(r => r.userName === review.userName);
    
    if (existingReviewIndex !== -1) {
      
      toyRatings[existingReviewIndex] = review;
    } else {
     
      toyRatings.push(review);
    }
    
    currentRatings[toyId] = toyRatings;
    this.ratings.next(currentRatings);
  }
  
  
  getRatings(toyId: number): Review[] {
    return this.ratings.getValue()[toyId] || [];
  }
  
  
  getAverageRating(toyId: number): number {
    const ratings = this.getRatings(toyId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((total, review) => total + review.rating, 0);
    return sum / ratings.length;
  }
  
 
  getRatingCount(toyId: number): number {
    return this.getRatings(toyId).length;
  }
}
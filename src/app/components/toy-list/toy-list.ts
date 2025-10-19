import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Toy, Review } from '../../models/toy';
import { ToyService } from '../../services/toy.service';

@Component({
  selector: 'app-toy-list',
  templateUrl: './toy-list.html',
  styleUrls: ['./toy-list.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ToyList implements OnInit, OnDestroy {
  toys: Toy[] = [];
  displayedToys: Toy[] = [];
  isLoading: boolean = true;
  error: string = '';
  private subscription: Subscription = new Subscription();

  // UKLONITE RatingService AKO GA NE KORISTITE
  constructor(private toyService: ToyService) { }

  ngOnInit(): void {
    this.loadToys();
    
    this.subscription.add(
      this.toyService.getToysObservable().subscribe(toys => {
        if (toys && toys.length > 0) {
          this.toys = [...toys];
          this.displayedToys = [...toys];
          this.isLoading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadToys(): void {
    this.isLoading = true;
    this.error = '';
    
    this.toyService.getAllToys().subscribe({
      next: (toys: Toy[]) => {
        this.toys = toys;
        this.displayedToys = toys;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = 'Došlo je do greške pri učitavanju igračaka. Pokušajte ponovo.';
        this.isLoading = false;
        console.error('Greška:', error);
      }
    });
  }

  getTypeName(type: any): string {
    if (typeof type === 'string') return type;
    if (type && typeof type === 'object' && type.name) return type.name;
    return 'Nepoznato';
  }

  getAgeGroupName(ageGroup: any): string {
    if (typeof ageGroup === 'string') return ageGroup;
    if (ageGroup && typeof ageGroup === 'object' && ageGroup.name) return ageGroup.name;
    return 'Nepoznato';
  }

  reserveToy(toy: Toy): void {
    const success = this.toyService.reserveToy(toy);
    if (success) {
      console.log('Igračka rezervisana:', toy.name);
    }
  }

  formatPrice(price: number): string {
    return price.toFixed(2) + ' RSD';
  }

  getAverageRating(toy: Toy): number {
    if (!toy.reviews || toy.reviews.length === 0) {
      return 0;
    }
    
    const sum = toy.reviews.reduce((total: number, review: any) => total + review.rating, 0);
    return sum / toy.reviews.length;
  }

  getTargetGroupLabel(targetGroup: string): string {
    switch (targetGroup) {
      case 'svi': return 'Svi';
      case 'dečak': return 'Dečak';
      case 'devojčica': return 'Devojčica';
      default: return targetGroup;
    }
  }

}
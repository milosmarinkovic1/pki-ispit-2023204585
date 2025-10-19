import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Toy } from '../../models/toy';
import { ToyService } from '../../services/toy.service';

@Component({
  selector: 'app-toy-detail',
  templateUrl: './toy-detail.html',
  styleUrls: ['./toy-detail.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ToyDetail implements OnInit {
  toy: Toy | null = null;
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private toyService: ToyService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadToy(parseInt(id));
    }
  }

  loadToy(id: number): void {
    this.isLoading = true;
    this.toyService.getToyById(id).subscribe({
      next: (toy: Toy) => {
        this.toy = toy;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = 'Došlo je do greške pri učitavanju igračke.';
        this.isLoading = false;
        console.error('Greška:', error);
      }
    });
  }

  reserveToy(): void {
    if (this.toy) {
      const success = this.toyService.reserveToy(this.toy);
      if (success) {
        alert(`Uspešno ste rezervisali: ${this.toy.name}`);
      }
    }
  }

  formatPrice(price: number): string {
    return price.toFixed(2) + ' RSD';
  }

  getAverageRating(): number {
    if (!this.toy?.reviews || this.toy.reviews.length === 0) return 0;
    return this.toy.reviews.reduce((sum, review) => sum + review.rating, 0) / this.toy.reviews.length;
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

  getTargetGroupLabel(targetGroup: string): string {
    const labels: {[key: string]: string} = {
      'svi': 'Svi',
      'dečak': 'Dečak', 
      'devojčica': 'Devojčica'
    };
    return labels[targetGroup] || targetGroup;
  }
}
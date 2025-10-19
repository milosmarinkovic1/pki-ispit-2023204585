import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toy, ToyFilter } from '../../models/toy'; // ISPRAVLJENA
import { ToyService } from '../../services/toy.service';
import { AgeGroup } from '../../models/age-group';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Search implements OnInit {
  filter: ToyFilter = {};
  searchResults: Toy[] = [];
  toyTypes: string[] = [];
  ageGroups: string[] = [];
  isSearching: boolean = false;

  constructor(private toyService: ToyService) { }

  ngOnInit(): void {
    this.loadToyTypes();
    this.loadAgeGroups();
  }

  loadToyTypes(): void {
    this.toyService.getToyTypes().subscribe({
      next: (types: any) => {
        this.toyTypes = types.map((type: any) => {
          if (typeof type === 'string') return type;
          if (type?.name) return type.name;
          return String(type);
        }).filter((type: string) => type && type !== 'undefined');
      },
      error: () => {
        this.toyTypes = ['Slagalica', 'Figura', 'Slikovnica', 'Karakter'];
      }
    });
  }

  loadAgeGroups(): void {
    this.toyService.getAgeGroups().subscribe({
      next: (groups: AgeGroup[]) => {
        this.ageGroups = groups.map((group: AgeGroup) => group.name);
      },
      error: (error: any) => {
        console.error('Greška pri učitavanju starosnih grupa:', error);
        this.ageGroups = [];
      }
    });
  }

  search(): void {
    this.isSearching = true;
    
    const cleanFilter = { ...this.filter };
    Object.keys(cleanFilter).forEach(key => {
      const value = cleanFilter[key as keyof ToyFilter];
      if (value === '' || value === undefined || value === null) {
        delete cleanFilter[key as keyof ToyFilter];
      }
    });
    
    this.toyService.searchToys(cleanFilter).subscribe({
      next: (results: Toy[]) => {
        this.searchResults = results;
        this.isSearching = false;
      },
      error: (error: any) => {
        console.error('Greška pri pretrazi:', error);
        this.isSearching = false;
        alert('Došlo je do greške pri pretrazi.');
      }
    });
  }

  resetFilter(): void {
    this.filter = {};
    this.searchResults = [];
  }

getAverageRating(toy: Toy): number {
    if (!toy.reviews || toy.reviews.length === 0) {
      return 0;
    }
    
    const sum = toy.reviews.reduce((total: number, review: any) => total + review.rating, 0);
    return sum / toy.reviews.length;
  }

  formatPrice(price: number): string {
    return price.toFixed(2) + ' RSD';
  }

  getTargetGroupLabel(targetGroup: string): string {
    const labels: {[key: string]: string} = {
      'svi': 'Svi',
      'dečak': 'Dečak', 
      'devojčica': 'Devojčica'
    };
    return labels[targetGroup] || targetGroup;
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

  // Dodajte ovu metodu u ToyList i Search komponente
reserveToy(toy: Toy): void {
  const success = this.toyService.reserveToy(toy);
  if (success) {
    console.log('Igračka rezervisana:', toy.name);
    // Opciono: možete dodati i debug prikaz
    this.toyService.debugCart();
  }
}
}
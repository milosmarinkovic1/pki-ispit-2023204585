import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Toy } from '../../models/toy';
import { ToyService } from '../../services/toy.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class Cart implements OnInit {
  cartItems: Toy[] = [];
  totalPrice: number = 0;
  isLoggedIn: boolean = false;

  constructor(
    private toyService: ToyService,
    private userService: UserService
  ) { }

    ngOnInit(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    
    
    if (!this.isLoggedIn) {
      this.clearCartData();
    } else {
      this.loadCart();
    }
  }

  private clearCartData(): void {
    this.cartItems = [];
    this.totalPrice = 0;
    localStorage.removeItem('toyShopCart');
  }


  loadCart(): void {
    this.cartItems = this.toyService.getCartItems();
    this.totalPrice = this.toyService.getTotalPrice();
  }

  removeFromCart(toyId: number | undefined): void {
    if (!toyId) return;
    
    if (confirm('Da li ste sigurni da želite da uklonite ovu igračku iz korpe?')) {
      this.toyService.removeFromCart(toyId);
      this.loadCart();
    }
  }

  updateToyStatus(toy: Toy, newStatus: 'rezervisano' | 'pristiglo' | 'otkazano'): void {
    const updatedToy = { ...toy, status: newStatus };
    this.toyService.updateToyInCart(updatedToy);
    this.loadCart();
  }

  getTypeName(type: any): string {
    if (typeof type === 'string') return type;
    if (type && typeof type === 'object' && type.name) return type.name;
    return 'Nepoznato';
  }


 rateToy(toy: Toy, rating: string): void {
  const numericRating = parseInt(rating);
  if (!numericRating || numericRating < 1 || numericRating > 5) return;

  const currentUser = this.userService.getCurrentUser();
  
  if (currentUser && toy.id) {
    if (confirm(`Da li želite da ocenite "${toy.name}" sa ${numericRating} zvezdica?`)) {
      this.toyService.rateToy(
        toy.id, 
        numericRating, 
        `Ocena od ${currentUser.firstName}`,
        `${currentUser.firstName} ${currentUser.lastName}`
      );
      
      //osveži korpu 
      setTimeout(() => {
        this.loadCart();
      }, 100);
    }
  }
}

  formatPrice(price: number): string {
    return price.toFixed(2) + ' RSD';
  }

  getAverageRating(toy: Toy): number {
    if (!toy.reviews || toy.reviews.length === 0) {
      return 0;
    }
    
    const sum = toy.reviews.reduce((total, review) => total + review.rating, 0);
    return sum / toy.reviews.length;
  }

  canModifyToy(toy: Toy): boolean {
    return toy.status === 'rezervisano';
  }

  canRateToy(toy: Toy): boolean {
    return toy.status === 'pristiglo';
  }

  canRemoveToy(toy: Toy): boolean {
    return true;
  }

  getToyId(toy: Toy): number {
    return toy.id || toy.toyId || 0;
  }
}
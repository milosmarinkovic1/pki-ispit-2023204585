import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Profile implements OnInit {
  user: User | null = null;
  isEditing: boolean = false;
  editedUser: User | null = null;
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = this.userService.getCurrentUser();
  }

  startEditing(): void {
    this.isEditing = true;
    this.editedUser = this.user ? { ...this.user } : null;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editedUser = null;
    this.successMessage = '';
  }

  saveProfile(): void {
    if (this.editedUser) {
      const success = this.userService.updateProfile(this.editedUser);
      
      if (success) {
        this.user = { ...this.editedUser };
        this.isEditing = false;
        this.editedUser = null;
        this.successMessage = 'Profil je uspešno ažuriran!';
        
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
      }
    }
  }

  // SAMO DVE METODE
  onFavoriteTypeChange(type: string): void {
    if (this.editedUser) {
      if (type) {
        this.editedUser.favoriteToyTypes = [type];
      } else {
        this.editedUser.favoriteToyTypes = [];
      }
    }
  }

  getFavoriteType(): string {
    return this.editedUser?.favoriteToyTypes?.[0] || '';
  }
}
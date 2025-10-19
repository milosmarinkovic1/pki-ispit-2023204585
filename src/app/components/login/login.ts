import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule]
})

export class Login {
  loginData = {
    username: '',
    password: ''
  };
  
  registerData: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    favoriteToyTypes: [],
    username: '',
    password: '',
    isLoggedIn: false
  };
  
  isLoginMode: boolean = true;
  error: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

 
  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.loginData = { username: '', password: '' };
  }

  login(): void {
    if (!this.loginData.username || !this.loginData.password) {
      this.error = 'Molimo unesite korisničko ime i lozinku.';
      return;
    }
    
    const success = this.userService.login(this.loginData.username, this.loginData.password);
    
    if (success) {
      alert('Uspešno ste se prijavili!');
      this.router.navigate(['/toys']);
    } else {
      this.error = 'Pogrešno korisničko ime ili lozinka.';
    }
  }

  register(): void {
    if (!this.registerData.firstName || !this.registerData.lastName || 
        !this.registerData.email || !this.registerData.username || 
        !this.registerData.password) {
      this.error = 'Molimo popunite sva obavezna polja.';
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.error = 'Molimo unesite validnu email adresu.';
      return;
    }
    
    const success = this.userService.register(this.registerData);
    
    if (success) {
      alert('Uspešno ste se registrovali!');
      this.router.navigate(['/toys']);
    } else {
      this.error = 'Došlo je do greške pri registraciji. Pokušajte ponovo.';
    }
  }

  toggleFavoriteType(type: string): void {
    const index = this.registerData.favoriteToyTypes.indexOf(type);
    
    if (index === -1) {
      this.registerData.favoriteToyTypes.push(type);
    } else {
      this.registerData.favoriteToyTypes.splice(index, 1);
    }
  }

  isFavoriteType(type: string): boolean {
    return this.registerData.favoriteToyTypes.includes(type);
  }
}
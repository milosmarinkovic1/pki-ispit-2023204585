import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule]
})
export class App {
  title = 'Digitalna Prodavnica Igračaka';
  
  constructor(private userService: UserService) {}
  
  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
  
  logout(): void {
    this.userService.logout();
    alert('Uspešno ste se odjavili!');
  }
}
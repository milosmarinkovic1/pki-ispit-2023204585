import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({  // Korena komponenta
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ispit za predmet pki-2023204585');
}

import { Component, signal, OnInit } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { InitAuth } from './store/auth.actions';

@Component({
  selector: 'app-root',
    standalone: true,
  imports: [Navbar,RouterOutlet, ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('projet_web');

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Charger l'état d'authentification depuis les cookies au démarrage
    this.store.dispatch(new InitAuth());
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../store/auth.state';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isAuthenticated$!: Observable<boolean>;
  user$!: Observable<any>;

  constructor(private authService: AuthService, private router: Router, private store: Store) {}

  ngOnInit(): void {
    // Utiliser store.select au lieu de @Select
    this.isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
    this.user$ = this.store.select(AuthState.user);
    
    // Debug: afficher l'état initial
    this.isAuthenticated$.subscribe(isAuth => {
      console.log('Navbar - isAuthenticated:', isAuth);
    });
    this.user$.subscribe(user => {
      console.log('Navbar - user:', user);
    });
  }

  logout(): void {
    console.log('Logout appelé');
    this.authService.logout();
    console.log('Après logout, token:', this.authService.getToken());
    // Recharger la page pour forcer la mise à jour de l'UI
    window.location.href = '/';
  }
}

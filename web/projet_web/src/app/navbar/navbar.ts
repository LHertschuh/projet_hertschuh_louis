import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isAuthenticated$: Observable<boolean>;
  user$: Observable<any>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {
    this.isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
    this.user$ = this.store.select(AuthState.user);
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    // Recharger la page pour forcer la mise à jour de l'UI
    window.location.href = '/';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  isLoggedIn: boolean = false;
  user: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getUser();
    
    console.log('=== État de connexion ===');
    console.log('Connecté:', this.isLoggedIn);
    console.log('Utilisateur:', this.user);
    console.log('Token:', this.authService.getToken());
    console.log('========================');
  }
}

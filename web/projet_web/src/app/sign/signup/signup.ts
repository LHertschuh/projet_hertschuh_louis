import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  name: string = '';
  password: string = '';
  email: string = '';
  confirmpassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.name || !this.email || !this.password || !this.confirmpassword) {
      this.errorMessage = 'Tous les champs sont requis';
      return;
    }

    if (this.password !== this.confirmpassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    // Appel au service
    this.authService.signup(this.name, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        this.successMessage = 'Compte créé avec succès ! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        if (error.status === 500 && error.error.message.includes('Duplicate entry')) {
          this.errorMessage = 'Cet email est déjà utilisé';
        } else {
          this.errorMessage = error.error?.message || 'Erreur lors de la création du compte';
        }
      }
    });
  }

}

import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Tous les champs sont requis';
      return;
    }

    // Appel au service
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Connexion réussie:', response);
        
        // Sauvegarder le token et l'utilisateur dans le store
        this.authService.saveToken(response.token);
        this.authService.saveUser(response.user);
        
        this.successMessage = 'Connexion réussie ! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error) => {
        console.error('Erreur lors de la connexion:', error);
        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 404) {
          this.errorMessage = 'Utilisateur non trouvé';
        } else {
          this.errorMessage = error.error?.message || 'Erreur lors de la connexion';
        }
      }
    });
  }
}

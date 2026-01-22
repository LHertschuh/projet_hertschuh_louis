import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PollutionService } from '../../services/pollution.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-pollution',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './create-pollution.html',
  styleUrl: './create-pollution.css',
})
export class CreatePollution implements OnInit {
  // Champs du formulaire
  titre: string = '';
  typePollution: string = '';
  description: string = '';
  dateObservation: string = '';
  lieu: string = '';
  latitude: number = 0;
  longitude: number = 0;
  photoUrl: string = '';

  // Types de pollution disponibles (depuis le backend)
  typesPollution = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

  // Messages
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  // Utilisateur connecté
  currentUser: any = null;

  constructor(
    private pollutionService: PollutionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) {
      this.errorMessage = 'Vous devez être connecté pour créer un signalement';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }

    // Définir la date d'observation à aujourd'hui par défaut
    const today = new Date();
    this.dateObservation = today.toISOString().split('T')[0];
  }

  // Obtenir la position GPS de l'utilisateur
  getCurrentLocation(): void {
    if (navigator.geolocation) {
      this.isLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.isLoading = false;
          this.successMessage = 'Position GPS obtenue !';
          setTimeout(() => this.successMessage = '', 3000);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Impossible d\'obtenir votre position GPS';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      );
    } else {
      this.errorMessage = 'La géolocalisation n\'est pas supportée par votre navigateur';
    }
  }

  // Gérer l'upload de photo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner une image valide';
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'L\'image est trop grande (max 5MB)';
        return;
      }

      // Convertir en base64
      const reader = new FileReader();
      reader.onload = () => {
        this.photoUrl = reader.result as string; // Stocke la chaîne base64
        this.successMessage = 'Image chargée avec succès !';
        setTimeout(() => this.successMessage = '', 3000);
      };
      reader.onerror = () => {
        this.errorMessage = 'Erreur lors de la lecture de l\'image';
      };
      reader.readAsDataURL(file); // Lit le fichier en base64
    }
  }

  // Soumettre le formulaire
  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.titre || !this.typePollution || !this.description || 
        !this.dateObservation || !this.lieu) {
      this.errorMessage = 'Tous les champs obligatoires doivent être remplis';
      return;
    }

    if (this.latitude === 0 || this.longitude === 0) {
      this.errorMessage = 'Veuillez fournir des coordonnées GPS valides';
      return;
    }

    // Créer l'objet pollution
    const pollution = {
      IdUtilisateur: this.currentUser?.id || null,
      Titre: this.titre,
      TypePollution: this.typePollution,
      Description: this.description,
      DateObservation: this.dateObservation,
      Lieu: this.lieu,
      Latitude: this.latitude,
      Longitude: this.longitude,
      PhotoUrl: this.photoUrl || null
    };

    this.isLoading = true;

    // Appel au service
    this.pollutionService.create(pollution).subscribe({
      next: (response) => {
        console.log('Pollution créée:', response);
        this.successMessage = 'Signalement créé avec succès ! Redirection...';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la création du signalement';
      }
    });
  }

  // Annuler et retourner à l'accueil
  cancel(): void {
    this.router.navigate(['/']);
  }
}

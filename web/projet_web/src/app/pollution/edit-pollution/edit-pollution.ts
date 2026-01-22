import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PollutionService } from '../../services/pollution.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-pollution',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './edit-pollution.html',
  styleUrl: './edit-pollution.css',
})
export class EditPollution implements OnInit {
  pollutionId: number = 0;
  titre: string = '';
  typePollution: string = '';
  description: string = '';
  dateObservation: string = '';
  lieu: string = '';
  latitude: number = 0;
  longitude: number = 0;
  photoUrl: string = '';

  typesPollution = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private pollutionService: PollutionService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) {
      this.errorMessage = 'Vous devez être connecté pour modifier un signalement';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pollutionId = parseInt(id);
      this.loadPollution(this.pollutionId);
    }
  }

  loadPollution(id: number): void {
    this.isLoading = true;
    this.pollutionService.getById(id).subscribe({
      next: (data) => {
        this.titre = data.Titre;
        this.typePollution = data.TypePollution;
        this.description = data.Description;
        this.dateObservation = data.DateObservation;
        this.lieu = data.Lieu;
        this.latitude = data.Latitude;
        this.longitude = data.Longitude;
        this.photoUrl = data.PhotoUrl || '';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.errorMessage = 'Impossible de charger la pollution';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

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
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner une image valide';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'L\'image est trop grande (max 5MB)';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.photoUrl = reader.result as string;
        this.successMessage = 'Image chargée avec succès !';
        setTimeout(() => this.successMessage = '', 3000);
      };
      reader.onerror = () => {
        this.errorMessage = 'Erreur lors de la lecture de l\'image';
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.titre || !this.typePollution || !this.description || 
        !this.dateObservation || !this.lieu) {
      this.errorMessage = 'Tous les champs obligatoires doivent être remplis';
      return;
    }

    if (this.latitude === 0 || this.longitude === 0) {
      this.errorMessage = 'Veuillez fournir des coordonnées GPS valides';
      return;
    }

    const pollution = {
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

    this.pollutionService.update(this.pollutionId, pollution).subscribe({
      next: (response) => {
        this.successMessage = 'Signalement mis à jour avec succès ! Redirection...';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/pollution', this.pollutionId]);
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour du signalement';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/pollution', this.pollutionId]);
  }
}

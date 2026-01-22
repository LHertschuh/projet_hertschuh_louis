import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PollutionService } from '../../services/pollution.service';
import { AuthService } from '../../services/auth.service';
import { FavorisService } from '../../services/favoris.service';

@Component({
  selector: 'app-detail-pollution',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-pollution.html',
  styleUrl: './detail-pollution.css',
})
export class DetailPollution implements OnInit {
  pollution: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  isFavorite: boolean = false;
  isCheckingFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pollutionService: PollutionService,
    private authService: AuthService,
    private favorisService: FavorisService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPollution(parseInt(id));
    } else {
      this.errorMessage = 'ID de pollution invalide';
      this.isLoading = false;
    }
  }

  loadPollution(id: number): void {
    this.pollutionService.getById(id).subscribe({
      next: (data) => {
        this.pollution = data;
        this.isLoading = false;
        // Vérifier si la pollution est en favoris
        if (this.authService.isLoggedIn()) {
          this.checkFavoriteStatus(id);
        }
        // Forcer la détection de changement
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la pollution:', error);
        this.errorMessage = 'Pollution non trouvée';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getPollutionIcon(type: string): string {
    const icons: any = {
      'Plastique': '♻️',
      'Chimique': '⚗️',
      'Dépôt sauvage': '🗑️',
      'Eau': '💧',
      'Air': '💨',
      'Autre': '⚠️'
    };
    return icons[type] || '📍';
  }

  getRelativeTime(date: string): string {
    const now = new Date();
    const pollutionDate = new Date(date);
    const diffMs = now.getTime() - pollutionDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      return 'Il y a quelques minutes';
    }
  }

  openInMaps(): void {
    if (this.pollution) {
      const url = `https://www.google.com/maps?q=${this.pollution.Latitude},${this.pollution.Longitude}`;
      window.open(url, '_blank');
    }
  }

  canEditPollution(): boolean {
    const currentUser = this.authService.getUser();
    return currentUser && this.pollution && currentUser.id === this.pollution.IdUtilisateur;
  }

  deletePollution(): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette pollution ? Cette action est irréversible.')) {
      return;
    }

    this.pollutionService.delete(this.pollution.IdPollution).subscribe({
      next: () => {
        alert('Pollution supprimée avec succès');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la pollution');
      }
    });
  }

  checkFavoriteStatus(pollutionId: number): void {
    this.isCheckingFavorite = true;
    this.favorisService.check(pollutionId).subscribe({
      next: (response) => {
        this.isFavorite = response.isFavorite;
        this.isCheckingFavorite = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la vérification des favoris:', error);
        this.isCheckingFavorite = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Vous devez être connecté pour ajouter aux favoris');
      this.router.navigate(['/login']);
      return;
    }

    if (this.isFavorite) {
      this.favorisService.remove(this.pollution.IdPollution).subscribe({
        next: () => {
          this.isFavorite = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du favori:', error);
          alert('Erreur lors de la suppression du favori');
        }
      });
    } else {
      this.favorisService.add(this.pollution.IdPollution).subscribe({
        next: () => {
          this.isFavorite = true;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout aux favoris:', error);
          alert('Erreur lors de l\'ajout aux favoris');
        }
      });
    }
  }
}

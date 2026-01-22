import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FavorisService } from '../services/favoris.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favoris.html',
  styleUrl: './favoris.css',
})
export class Favoris implements OnInit {
  pollutions: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private favorisService: FavorisService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadFavoris();
  }

  loadFavoris(): void {
    this.favorisService.getAll().subscribe({
      next: (data) => {
        this.pollutions = data.map((pollution: any) => ({
          ...pollution,
          relativeTime: this.getRelativeTime(pollution.CreeLe),
          icon: this.getPollutionIcon(pollution.TypePollution)
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des favoris:', error);
        this.errorMessage = 'Erreur lors du chargement de vos favoris';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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

  removeFavoris(pollution: any, event: Event): void {
    event.stopPropagation();

    this.favorisService.remove(pollution.IdPollution).subscribe({
      next: () => {
        this.pollutions = this.pollutions.filter(p => p.IdPollution !== pollution.IdPollution);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du favori');
      }
    });
  }
}

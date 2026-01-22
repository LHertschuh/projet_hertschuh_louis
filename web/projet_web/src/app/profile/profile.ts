import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PollutionService } from '../services/pollution.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  currentUser: any = null;
  pollutions: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private pollutionService: PollutionService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserPollutions();
  }

  loadUserPollutions(): void {
    this.pollutionService.getByUserId(this.currentUser.id).subscribe({
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
        console.error('Erreur lors du chargement des pollutions:', error);
        this.errorMessage = 'Erreur lors du chargement de vos pollutions';
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

  deletePollution(pollution: any, event: Event): void {
    event.stopPropagation();
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${pollution.Titre}" ?`)) {
      return;
    }

    this.pollutionService.delete(pollution.IdPollution).subscribe({
      next: () => {
        // Retirer la pollution de la liste
        this.pollutions = this.pollutions.filter(p => p.IdPollution !== pollution.IdPollution);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la pollution');
      }
    });
  }
}

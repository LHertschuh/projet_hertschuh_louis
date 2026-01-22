import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PollutionService } from '../services/pollution.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  isLoggedIn: boolean = false;
  user: any = null;
  pollutions: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private pollutionService: PollutionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getUser();

    // Charger les pollutions
    this.loadPollutions();
  }

  loadPollutions(): void {
    this.isLoading = true;
    this.pollutionService.getAll().subscribe({
      next: (data) => {
        // Enrichir les données avec les infos calculées
        this.pollutions = data.map((pollution: any) => ({
          ...pollution,
          relativeTime: this.getRelativeTime(pollution.CreeLe),
          icon: this.getPollutionIcon(pollution.TypePollution)
        }));
        this.isLoading = false;
        // Forcer la détection de changement
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des pollutions:', error);
        this.errorMessage = 'Erreur lors du chargement des pollutions';
        this.isLoading = false;
      }
    });
  }

  private getRelativeTime(date: string): string {
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

  private getPollutionIcon(type: string): string {
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
}

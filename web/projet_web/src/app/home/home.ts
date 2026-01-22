import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { PollutionService } from '../services/pollution.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  user: any = null;
  pollutions: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private authService: AuthService,
    private pollutionService: PollutionService,
    private cdr: ChangeDetectorRef
  ) {
    // Debounce de 500ms pour la recherche
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadPollutions();
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getUser();

    // Charger les pollutions
    this.loadPollutions();
  }

  loadPollutions(): void {
    // Éviter de relancer si déjà en chargement
    if (this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    const trimmedQuery = this.searchQuery?.trim();
    const query = trimmedQuery && trimmedQuery.length > 0 ? trimmedQuery : undefined;
    
    this.pollutionService.getAll(query).subscribe({
      next: (data) => {
        // Enrichir les données avec les infos calculées
        this.pollutions = data.map((pollution: any) => ({
          ...pollution,
          relativeTime: this.getRelativeTime(pollution.CreeLe),
          icon: this.getPollutionIcon(pollution.TypePollution)
        }));
        this.isLoading = false;
        // Forcer la détection de changement
        tsearchSubject.next(this.searchQuery);
  }

  ngOnDestroy(): void {
    this.searchSubject.completeChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des pollutions:', error);
        this.errorMessage = 'Erreur lors du chargement des pollutions';
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.loadPollutions();
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetToken, ClearToken, SetUser, ClearUser } from '../store/auth.actions';
import { AuthState } from '../store/auth.state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://projet-hertschuh-louis-api.onrender.com/api/utilisateur';

  constructor(private http: HttpClient, private store: Store) {}

  signup(nom: string, email: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      Nom: nom,
      Email: email,
      MotDePasse: motDePasse
    });
  }

  login(email: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email: email,
      password: motDePasse
    });
  }

  saveToken(token: string): void {
    this.store.dispatch(new SetToken(token));
  }

  saveUser(user: any): void {
    this.store.dispatch(new SetUser(user));
  }

  getToken(): string | null {
    return this.store.selectSnapshot(AuthState.token);
  }

  getUser(): any | null {
    return this.store.selectSnapshot(AuthState.user);
  }

  logout(): void {
    this.store.dispatch(new ClearToken());
    this.store.dispatch(new ClearUser());
  }

  isLoggedIn(): boolean {
    return this.store.selectSnapshot(AuthState.isAuthenticated);
  }
}

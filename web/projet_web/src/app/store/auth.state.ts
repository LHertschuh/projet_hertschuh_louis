import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { InitAuth, SetToken, ClearToken, SetUser, ClearUser } from './auth.actions';
import { AuthStateModel } from './auth.state.model';
import { CookieService } from 'ngx-cookie-service';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: null,
    user: null
  }
})
@Injectable()
export class AuthState {
  constructor(private cookieService: CookieService) {}
  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static user(state: AuthStateModel): any | null {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return !!state.token;
  }

  @Action(InitAuth)
  initAuth(ctx: StateContext<AuthStateModel>) {
    try {
      // Charger depuis les cookies
      const token = this.cookieService.get('auth_token') || null;
      const userStr = this.cookieService.get('auth_user');
      let user = null;
      
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error('Erreur parsing user cookie:', e);
          // Supprimer le cookie corrompu
          this.cookieService.delete('auth_user', '/');
        }
      }
      
      ctx.patchState({ token, user });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      ctx.patchState({ token: null, user: null });
    }
  }

  @Action(SetToken)
  setToken(ctx: StateContext<AuthStateModel>, action: SetToken) {
    // Sauvegarder dans les cookies (expire dans 7 jours)
    this.cookieService.set('auth_token', action.token, 7, '/');
    ctx.patchState({
      token: action.token
    });
  }

  @Action(ClearToken)
  clearToken(ctx: StateContext<AuthStateModel>) {
    console.log('Action ClearToken appelée');
    // Supprimer le cookie
    this.cookieService.delete('auth_token', '/');
    ctx.patchState({
      token: null
    });
    console.log('Token supprimé, nouveau state:', ctx.getState());
  }

  @Action(SetUser)
  setUser(ctx: StateContext<AuthStateModel>, action: SetUser) {
    // Sauvegarder dans les cookies (expire dans 7 jours)
    this.cookieService.set('auth_user', JSON.stringify(action.user), 7, '/');
    ctx.patchState({
      user: action.user
    });
  }

  @Action(ClearUser)
  clearUser(ctx: StateContext<AuthStateModel>) {
    console.log('Action ClearUser appelée');
    // Supprimer le cookie
    this.cookieService.delete('auth_user', '/');
    ctx.patchState({
      user: null
    });
    console.log('User supprimé, nouveau state:', ctx.getState());
  }
}

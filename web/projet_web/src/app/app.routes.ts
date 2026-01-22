import { Routes } from '@angular/router';
import { Signup } from './sign/signup/signup';
import { Login } from './sign/login/login';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login }
];
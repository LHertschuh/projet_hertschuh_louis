import { Routes } from '@angular/router';
import { Signup } from './sign/signup/signup';
import { Login } from './sign/login/login';
import { Home } from './home/home';
import { CreatePollution } from './pollution/create-pollution/create-pollution';
import { DetailPollution } from './pollution/detail-pollution/detail-pollution';
import { EditPollution } from './pollution/edit-pollution/edit-pollution';
import { Profile } from './profile/profile';
import { Favoris } from './favoris/favoris';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile },
  { path: 'favoris', component: Favoris },
  { path: 'pollution/create', component: CreatePollution },
  { path: 'pollution/:id/edit', component: EditPollution },
  { path: 'pollution/:id', component: DetailPollution }
];
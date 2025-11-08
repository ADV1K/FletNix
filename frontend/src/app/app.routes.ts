import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShowListComponent } from './components/show-list/show-list.component';
import { ShowDetailComponent } from './components/show-detail/show-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/shows', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'shows', component: ShowListComponent, /*canActivate: [authGuard]*/ },
  { path: 'shows/:id', component: ShowDetailComponent, /*canActivate: [authGuard]*/ },
  { path: '**', redirectTo: '/shows' },
];


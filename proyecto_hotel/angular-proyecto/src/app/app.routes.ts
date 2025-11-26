import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'habitaciones',
        loadComponent: () => import('./pages/habitaciones/habitaciones.component').then(m => m.HabitacionesComponent)
      },
      {
        path: 'servicios',
        loadComponent: () => import('./pages/servicios/servicios.component').then(m => m.ServiciosComponent)
      },
      {
        path: 'contacto',
        loadComponent: () => import('./pages/contacto/contacto.component').then(m => m.ContactoComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'reserva',
        loadComponent: () => import('./pages/reserva/reserva.component').then(m => m.ReservaComponent),
        canActivate: [authGuard]
      },
      {
        path: 'pago-confirmacion',
        loadComponent: () => import('./pages/pago-confirmacion/pago-confirmacion.component').then(m => m.PagoConfirmacionComponent),
        canActivate: [authGuard]
      },
      {
        path: 'pago-metodo',
        loadComponent: () => import('./pages/pago-metodo/pago-metodo.component').then(m => m.PagoMetodoComponent),
        canActivate: [authGuard]
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [authGuard]
      }
    ]
  }
];

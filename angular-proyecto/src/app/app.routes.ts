import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

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
        path: 'reserva',
        loadComponent: () => import('./pages/reserva/reserva.component').then(m => m.ReservaComponent)
      },
      {
        path: 'pago-confirmacion',
        loadComponent: () => import('./pages/pago-confirmacion/pago-confirmacion.component').then(m => m.PagoConfirmacionComponent)
      },
      {
        path: 'pago-metodo',
        loadComponent: () => import('./pages/pago-metodo/pago-metodo.component').then(m => m.PagoMetodoComponent)
      }
    ]
  }
];

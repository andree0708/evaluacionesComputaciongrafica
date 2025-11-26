import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MessageService } from 'primeng/api';

export interface User {
  id: number;
  nombre: string;
  nombreUsuario: string;
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService
  ) {}

  login(nombreUsuario: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.apiService.login(nombreUsuario, password).subscribe({
        next: (response) => {
          if (response.success) {
            const user: User = {
              id: response.id,
              nombre: response.nombre,
              nombreUsuario: response.nombreUsuario,
              email: response.email,
              rol: response.rol
            };
            this.setUser(user);
            observer.next(response);
            observer.complete();
          } else {
            observer.error(response.message || 'Credenciales incorrectas');
          }
        },
        error: (error) => {
          observer.error(error.error?.message || 'Error al iniciar sesión');
        }
      });
    });
  }

  logout(): void {
    const user = this.getCurrentUser();
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.messageService.add({
      severity: 'info',
      summary: 'Sesión cerrada',
      detail: 'Has cerrado sesión correctamente'
    });
    this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'Administrador';
  }

  isCliente(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'Cliente';
  }

  private setUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }
}

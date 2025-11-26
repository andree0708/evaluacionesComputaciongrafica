import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth.service';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, MessageModule, RouterLink, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  mostrarPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { nombreUsuario, password } = this.loginForm.value;

      this.authService.login(nombreUsuario, password).subscribe({
        next: (response) => {
          this.loading = false;
          // Redirigir según el rol
          if (response.rol === 'Administrador') {
            this.router.navigate(['/admin']);
          } else {
            // Si venía de una página de reserva, volver ahí
            const returnUrl = sessionStorage.getItem('returnUrl') || '/reserva';
            sessionStorage.removeItem('returnUrl');
            this.router.navigate([returnUrl]);
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
          } else {
            this.errorMessage = error.error?.message || 'Usuario o contraseña incorrectos.';
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos';
    }
  }
}

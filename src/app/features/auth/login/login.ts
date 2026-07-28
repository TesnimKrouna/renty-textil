import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  loading = false;
  errorMessage = '';

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6)]
      ]
    });

  }

  onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.authService.login(this.loginForm.value).subscribe({
    next: (res: any) => {
      this.loading = false;

      // === Étape 4 corrigée : sauvegarde du token ===
      if (res.accessToken) {  // vérifie le nom exact renvoyé par ton backend
        localStorage.setItem('token', res.accessToken);
        console.log('Token saved!');
      } else {
        console.warn('Aucun token reçu dans la réponse');
      }

      // === Gestion des rôles et redirection (comme dans ton code) ===
      const role = res.user?.role || res.role;
      const dashboardRoles = ['ADMIN', 'PRODUCT_MANAGER', 'FINANCE_MANAGER'];

      if (dashboardRoles.includes(role)) {
        this.router.navigateByUrl('/dashboard');
      } else {
        // redirection par défaut ou gestion d'autres rôles
        this.router.navigateByUrl('/home');
      }
    },
    error: (err) => {
      this.loading = false;
      this.errorMessage = 'Email ou mot de passe incorrect';
      console.error(err);
    }
  });
}}
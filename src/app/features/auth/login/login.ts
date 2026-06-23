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

    this.authService.login(this.loginForm.value as any).subscribe({

      next: (res: any) => {

        this.loading = false;

        const routes: Record<string, string> = {
          ADMIN: '/admin/dashboard',
          EMPLOYE: '/employe/accueil',
          CLIENT: '/client/accueil'
        };

        this.router.navigateByUrl(
          routes[res.role] || '/login'
        );
      },

      error: () => {

        this.loading = false;
        this.errorMessage =
          'Email ou mot de passe incorrect';

      }

    });
    

  }
  

}
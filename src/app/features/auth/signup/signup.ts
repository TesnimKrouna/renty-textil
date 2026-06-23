import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

function passwordsMatch(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword
    ? null
    : { mismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {

  loading = false;

  signupForm!: FormGroup;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.signupForm = this.fb.group({

      nomComplet: [
        '',
        Validators.required
      ],

      nomEntreprise: [
        '',
        Validators.required
      ],

      matriculeFiscale: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{8}$/)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      telephone: [
        '',
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.pattern(/^\d{5}$/)
      ],

      adresse: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]

    }, {
      validators: passwordsMatch
    });

  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.selectedFile = input.files[0];

      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formData = {
      ...this.signupForm.value,
      logo: this.selectedFile
    };

    this.authService.register(formData).subscribe({

      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/login');
      },

      error: (err) => {
        this.loading = false;
        console.error(err);
      }

    });

  }

}
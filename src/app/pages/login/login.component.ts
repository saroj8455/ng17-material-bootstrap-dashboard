import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { MaterialConfigModule } from '../../primeconfig/materialconfig.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialConfigModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false; // Controls the spinner
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form with validation rules
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Helper to easily access form controls in HTML
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    // 1. If form is invalid, mark all fields as touched to show errors
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // 2. Start Loader & Clear Errors
    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    // 3. Call Service
    this.authService.login(username, password).subscribe({
      next: (res) => {
        // SUCCESS
        console.log('Login Successful', res);

        // Optional: Reset form (though we are navigating away)
        this.loginForm.reset();

        // Stop Loader
        this.isLoading = false;

        // Redirect to Dashboard
        // Navigate to Dashboard and pass the 'res' object as 'userData'
    this.router.navigate(['/dashboard'], { 
      state: { userData: res } 
    });
      },
      error: (err) => {
        // ERROR
        console.error('Login Failed', err);
        this.errorMessage = 'Invalid username or password'; // Or use err.message
        this.isLoading = false;
      },
    });
  }

  // onGetMe() {
  //   this.authService.getMe().subscribe({
  //     next: (data) => this.output = data,
  //     error: (err) => this.output = 'Error: ' + err.message
  //   });
  // }

  // onRefresh() {
  //   this.authService.refreshToken().subscribe({
  //     next: (data) => this.output = data,
  //     error: (err) => this.output = 'Error: ' + err.message
  //   });
  // }
}

import { Component } from '@angular/core';
import { MaterialConfigModule } from '../../primeconfig/materialconfig.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialConfigModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
registerForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['female', Validators.required], // Default to 'female' matching your JSON
      image: [''], // Optional image URL
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    // Simulate API Call
    setTimeout(() => {
      console.log('Registration Data:', this.registerForm.value);
      this.isLoading = false;
      // Navigate to login or dashboard after success
      this.router.navigate(['/login']);
    }, 1500);
  }

  // Helper for template access
  get f() { return this.registerForm.controls; }
}

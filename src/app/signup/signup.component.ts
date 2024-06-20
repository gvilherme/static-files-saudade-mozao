import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  password: string = '';
  email: string = '';
  gender: string = '';
  full_name: string = '';
  errorMessage: string = '';
  isConfirmationStep: boolean = false;
  code: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  onSubmit() {
    if (this.isConfirmationStep) {
      this.confirmSignUp();
    } else {
      this.signUp();
    }
  }

  signUp() {
    this.authService.signUp(this.name, this.password, this.email, this.gender, this.full_name)
      .then((result) => {
        console.log('Signup successful', result);
        this.errorMessage = '';
        this.isConfirmationStep = true; // Avançar para o passo de confirmação
      })
      .catch((err) => {
        console.error('Signup failed', err);
        this.errorMessage = this.parseError(err);
      });
  }

  confirmSignUp() {
    this.authService.confirmSignUp(this.name, this.code)
      .then((result) => {
        console.log('Confirmation successful', result);
        this.errorMessage = '';
        this.router.navigate(['/home'], { state: { username: this.name } });
      })
      .catch((err) => {
        console.error('Confirmation failed', err);
        this.errorMessage = this.parseError(err);
      });
  }

  private parseError(err: any): string {
    if (err.code === 'InvalidPasswordException') {
      return 'The password does not conform to the password policy.';
    } else if (err.code === 'UsernameExistsException') {
      return 'An account with the given username already exists.';
    } else if (err.code === 'InvalidParameterException') {
      return 'The provided parameters are invalid. Please check your input.';
    } else if (err.code === 'CodeMismatchException') {
      return 'The confirmation code is incorrect. Please try again.';
    } else if (err.code === 'ExpiredCodeException') {
      return 'The confirmation code has expired. Please request a new code.';
    } else {
      return 'An unknown error occurred. Please try again.';
    }
  }
}
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  email: string = '';

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.signUp(this.username, this.password, this.email)
      .then((result) => {
        console.log('Signup successful', result);
      })
      .catch((err) => {
        console.error('Signup failed', err);
      });
  }
}
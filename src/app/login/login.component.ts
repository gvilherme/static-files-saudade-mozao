import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isMFARequired: boolean = false;
  mfaCode: string = '';

  constructor(private router: Router, private authService: AuthService, private userDataService: UserDataService) { }

  onSubmit() {
    if (this.isMFARequired) {
      this.confirmMFA();
    } else {
      this.signIn();
    }
  }

  signIn() {
    this.authService.signIn(this.username, this.password)
      .then((result) => {
        if (result.mfaRequired) {
          this.isMFARequired = true;
          this.errorMessage = 'MFA code required. Please enter the code sent to your device.';
        } else {
          console.log('Login successful', result);
          this.getUserAttributes();
        }
      })
      .catch((err) => {
        console.error('Login failed', err);
        this.errorMessage = this.parseError(err);
      });
  }

  confirmMFA() {
    this.authService.confirmMFA(this.mfaCode)
      .then((result) => {
        console.log('MFA confirmation successful', result);
        this.errorMessage = '';
        this.getUserAttributes();
      })
      .catch((err) => {
        console.error('MFA confirmation failed', err);
        this.errorMessage = this.parseError(err);
      });
  }

  navigateToCreateAccount() {
    this.router.navigate(['/signup'])
  }

  getUserAttributes() {
    this.authService.getUserAttributes()
      .then((attributes) => {
        console.log('User attributes', attributes);
        this.userDataService.setUserData({ username: attributes['name'], gender: attributes['gender'], email: attributes['email'] });
        this.router.navigate(['/home']);
      })
      .catch((err) => {
        console.error('Failed to get user attributes', err);
        this.errorMessage = this.parseError(err);
      });
  }

  private parseError(err: any): string {
    if (err.code === 'NotAuthorizedException') {
      return 'Incorrect username or password.';
    } else if (err.code === 'UserNotFoundException') {
      return 'User does not exist.';
    } else if (err.code === 'CodeMismatchException') {
      return 'The MFA code is incorrect. Please try again.';
    } else {
      return 'An unknown error occurred. Please try again.';
    }
  }

}
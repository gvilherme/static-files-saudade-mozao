import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    console.log("Username:", this.username); // Adiciona um log para verificar se a função está sendo chamada
    // Simulação de login
    // this.authService.signIn(this.username, this.password)
    //   .then((result) => {
    //     console.log('Login successful', result);
    //   })
    //   .catch((err) => {
    //     console.error('Login failed', err);
    //   });
    this.router.navigate(['/home'], { state: { username: this.username } });
  }

  navigateToCreateAccount() {
    this.router.navigate(['/signup'])
    // Navegue para a página de criação de conta
    // No momento, não temos uma página específica de criação de conta, mas você pode adicionar uma rota para ela.
  }
}
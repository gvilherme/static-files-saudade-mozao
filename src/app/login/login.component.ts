import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    console.log("Username:", this.username); // Adiciona um log para verificar se a função está sendo chamada
    // Simulação de login
    this.router.navigate(['/home'], { state: { username: this.username } });
  }

  navigateToCreateAccount() {
    console.log("Navigating to create account");
    // Navegue para a página de criação de conta
    // No momento, não temos uma página específica de criação de conta, mas você pode adicionar uma rota para ela.
  }
}
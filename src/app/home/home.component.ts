import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string = '';
  rosaTokens: number = 0;
  azulTokens: number = 0;
  tokenAmount: number = 0;
  tokenColor: string = 'rosa';
  rosaPercent: number = 0;
  azulPercent: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { username: string };
    if (state && state.username) {
      this.username = state.username;
    } else {
      // this.router.navigate(['/']);
    }
    this.updatePercents();
  }

  addToken() {
    if (this.tokenColor === 'rosa') {
      this.rosaTokens += this.tokenAmount;
    } else if (this.tokenColor === 'azul') {
      this.azulTokens += this.tokenAmount;
    }
    this.updatePercents();
  }

  updatePercents() {
    const totalTokens = this.rosaTokens + this.azulTokens;
    const maxPercent = 75;
    if (totalTokens > 0) {
      this.rosaPercent = (this.rosaTokens / totalTokens) * maxPercent;
      this.azulPercent = (this.azulTokens / totalTokens) * maxPercent;
    } else {
      this.rosaPercent = 0;
      this.azulPercent = 0;
    }
  }
}

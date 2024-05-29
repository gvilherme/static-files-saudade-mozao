import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string = '';
  pinkTokens: number = 0;
  blueTokens: number = 0;
  tokenAmount: number = 0;
  tokenColor: string = 'pink';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && state['username']) {
      this.username = state['username'];
    } else {
      this.router.navigate(['/']);
    }
  }

  addToken() {
    if (this.tokenColor === 'pink') {
      this.pinkTokens += this.tokenAmount;
    } else if (this.tokenColor === 'blue') {
      this.blueTokens += this.tokenAmount;
    }
  }
}

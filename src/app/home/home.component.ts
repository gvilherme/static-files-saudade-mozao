import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string = 'aa';
  pinkTokens: number = 0;
  blueTokens: number = 0;
  tokenAmount: number = 0;
  tokenColor: string = 'pink';

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.debug("aqui")
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { username: string };
    if (state && state.username) {
      this.username = state.username;
    } else {
      // TODO adicionar validação real
      // this.router.navigate(['/']);
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

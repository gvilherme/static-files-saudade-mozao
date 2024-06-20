import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  full_name: string;
  gender: string;
  rosaTokens: number = 0;
  azulTokens: number = 0;
  tokenAmount: number = 0;
  tokenColor: string = 'rosa';
  rosaPercent: number = 0;
  azulPercent: number = 0;

  constructor(private router: Router, private userDataService: UserDataService) {
    const userData = this.userDataService.getUserData();
    this.full_name = userData.username;
    this.gender = userData.gender;
  }

  ngOnInit(): void {
    if (this.gender == "Male") {
      this.tokenColor = "azul"
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { TokenService } from '../services/token.service';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  qrCodeBase64: string = '';
  paymentPending: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private userDataService: UserDataService, private tokenService: TokenService) {
    const userData = this.userDataService.getUserData();
    this.full_name = userData.username;
    this.gender = userData.gender;
  }

  ngOnInit(): void {
    if (this.gender == "Male") {
      this.tokenColor = "azul"
    }
    this.updatePercents();
    this.tokenService.getTokens("guilhermerodrigues890@gmail.com").subscribe(
      response => {
        this.azulTokens = response.amount
      },
      error => {
        this.errorMessage = error;
      }
    )
    this.tokenService.getTokens("juliaribeirosud@yahoo.com.br").subscribe(
      response => {
        this.rosaTokens = response.amount
      },
      error => {
        this.errorMessage = error;
      }
    )
  }

  addToken() {
    this.errorMessage = '';  // Clear previous errors
    this.tokenService.createToken(this.tokenAmount, this.tokenColor).subscribe(
      response => {
        this.qrCodeBase64 = response.qrCodeBase64;
        const tokenId = response.tokenId;
        this.paymentPending = true;
        this.waitForPaymentConfirmation(tokenId);
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  waitForPaymentConfirmation(tokenId: string) {
    interval(5000).pipe(
      switchMap(() => this.tokenService.checkPaymentStatus(tokenId))
    ).subscribe(
      response => {
        if (response.status === 'confirmed') {
          this.paymentPending = false;
          if (this.tokenColor === 'rosa') {
            this.rosaTokens += this.tokenAmount;
          } else if (this.tokenColor === 'azul') {
            this.azulTokens += this.tokenAmount;
          }
          this.qrCodeBase64 = '';
        }
      },
      error => {
        this.errorMessage = error;
      }
    );
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

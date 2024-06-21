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
  qrCodeUrl: string = '';
  paymentPending: boolean = false;

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
  }

  addToken() {
    this.tokenService.createQr(this.tokenAmount).subscribe(response => {
      this.qrCodeUrl = response.qrCodeUrl;
      const tokenId = response.tokenId;
      this.paymentPending = true;
      this.waitForPaymentConfirmation(tokenId);
    });
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

  waitForPaymentConfirmation(tokenId: string) {
    interval(5000).pipe(
      switchMap(() => this.tokenService.checkPaymentStatus(tokenId))
    ).subscribe(response => {
      if (response.status === 'confirmed') {
        this.paymentPending = false;
        if (this.tokenColor === 'rosa') {
          this.rosaTokens += this.tokenAmount;
        } else if (this.tokenColor === 'azul') {
          this.azulTokens += this.tokenAmount;
        }
        this.updatePercents();
        this.qrCodeUrl = '';
      }
    });
  }
}

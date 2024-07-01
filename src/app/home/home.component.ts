import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { TokenService } from '../services/token.service';
import { interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

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
  qrCode: string = '';
  paymentPending: boolean = false;
  paymentConfirmed: boolean = false;
  errorMessage: string = '';
  email: string = '';
  private stopPolling = new Subject<void>();

  constructor(private router: Router, private userDataService: UserDataService, private tokenService: TokenService) {
    const userData = this.userDataService.getUserData();
    console.log(userData)
    this.full_name = userData.username;
    this.gender = userData.gender;
    this.email = userData.email;
  }

  ngOnInit(): void {
    if (this.gender == "Male") {
      this.tokenColor = "azul"
    }
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
    this.updatePercents();
  }

  ngOnDestroy(): void {
    this.stopPolling.next();
    this.stopPolling.complete();
  }

  addToken() {
    this.errorMessage = '';  // Clear previous errors
    this.tokenService.createToken(this.tokenAmount.toFixed(2), this.gender, this.full_name, this.email).subscribe(
      response => {
        this.qrCodeBase64 = response.pointOfInteraction.transactionData.qrCodeBase64;
        this.qrCode = response.pointOfInteraction.transactionData.qrCode;
        const tokenId = response.id;
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
      switchMap(() => this.tokenService.checkPaymentStatus(tokenId, this.email)),
      takeUntil(this.stopPolling)
    ).subscribe(
      async response => {
        if (response.status === 'confirmed') {
          this.paymentPending = false;
          if (this.tokenColor === 'rosa') {
            this.rosaTokens += this.tokenAmount;
          } else if (this.tokenColor === 'azul') {
            this.azulTokens += this.tokenAmount;
          }
          this.qrCodeBase64 = '';
          this.paymentConfirmed = true;
          this.sleep(5000)
          this.paymentConfirmed = false;
          this.stopPolling.next();
        }
      },
      error => {
        this.errorMessage = error;
        this.stopPolling.next();
      }
    );
  }

  copyQrCode() {
    navigator.clipboard.writeText(this.qrCode).then(() => {
      console.log('Código QR copiado para a área de transferência');
    }).catch(err => {
      console.error('Erro ao copiar o código QR: ', err);
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

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

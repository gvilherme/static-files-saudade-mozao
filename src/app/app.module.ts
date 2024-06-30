import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { HeartComponent } from './home/heart/heart.component';
import { HttpClientModule  } from '@angular/common/http';
import { TokenService } from './services/token.service'; // Importação do serviço

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeartComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [TokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }

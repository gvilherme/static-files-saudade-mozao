import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userData: any = {};

  setUserData(data: any) {
    this.userData = data;
    localStorage.setItem('userData', JSON.stringify(data));
  }

  getUserData() {
    if (Object.keys(this.userData).length === 0) {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        this.userData = JSON.parse(storedData);
      }
    }
    return this.userData;
  }

  clearUserData() {
    this.userData = {};
    localStorage.removeItem('userData');
  }
}
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { CognitoUserPool, CognitoUserAttribute, AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_FG3XUWFnC', // Substitua pelo ID do seu User Pool
  ClientId: '3sbd3q89v13fkd4r6v8emtdal6' // Substitua pelo ID do seu App Client
};

const userPool = new CognitoUserPool(poolData);

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  cognitoUser: CognitoUser | null = null;

  constructor() { }

  signIn(username: string, password: string): Promise<any> {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: userPool
    };

    this.cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      this.cognitoUser!.authenticateUser(authenticationDetails, {
        onSuccess: (result: CognitoUserSession) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
        mfaRequired: (challengeName, challengeParameters) => {
          resolve({ mfaRequired: true });
        }
      });
    });
  }

  confirmMFA(code: string): Promise<any> {
    if (!this.cognitoUser) {
      return Promise.reject('User not authenticated');
    }

    return new Promise((resolve, reject) => {
      this.cognitoUser!.sendMFACode(code, {
        onSuccess: (result: CognitoUserSession) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  }

  getUserAttributes(): Promise<{ [key: string]: string }> {
    if (!this.cognitoUser) {
      return Promise.reject('User not authenticated');
    }

    return new Promise((resolve, reject) => {
      this.cognitoUser!.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err);
        } else {
          const userAttributes: { [key: string]: string } = {};
          attributes!.forEach(attribute => {
            userAttributes[attribute.Name] = attribute.Value;
          });
          resolve(userAttributes);
        }
      });
    });
  }

  signUp(username: string, password: string, email: string, gender: string,  fullName: string): Promise<any> {
    const attributeList: CognitoUserAttribute[] = [];

    const dataEmail = {
      Name: 'email',
      Value: email
    };

    const dataGender = {
      Name: 'gender',
      Value: gender
    };

    const dataFullName = {
      Name: 'custom:full_name',
      Value: fullName
    };

    const dataPhoneNumber = {
      Name: 'phone_number',
      Value: '+14325551212'
    };

    const dataFormattedName = {
      Name: 'name',
      Value: fullName
    };

    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributeGender = new CognitoUserAttribute(dataGender);
    const attributeFullName = new CognitoUserAttribute(dataFullName);
    const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
    const attributeFormattedName = new CognitoUserAttribute(dataFormattedName);
    attributeList.push(attributeEmail);
    attributeList.push(attributeGender);
    attributeList.push(attributeFullName);
    attributeList.push(attributePhoneNumber);
    attributeList.push(attributeFormattedName);

    return new Promise((resolve, reject) => {
      userPool.signUp(username, password, attributeList, [], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  confirmSignUp(username: string, code: string): Promise<any> {
    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
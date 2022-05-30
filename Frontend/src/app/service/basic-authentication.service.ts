import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL, AUTHENTICATED_USER, TOKEN } from '../app.constants';
import { map } from 'rxjs/operators';
import { Company } from '../common/company';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthenticationService {

  constructor(private http: HttpClient) { }

  login(email, password) {
    let basicAuthHeaderString = 'Basic ' + window.btoa(email + ':' + password)

    let headers = new HttpHeaders({
      Authorization: basicAuthHeaderString
    })

    return this.http.post<any>(`${API_URL}/company/authenticate`, { email, password })
      .pipe(map(data => {
        if (password === data.password) {
          sessionStorage.setItem(AUTHENTICATED_USER, data.email);
          sessionStorage.setItem(TOKEN, basicAuthHeaderString);
        }
      }))

  }

  getAuthenticatedUser() {
    return sessionStorage.getItem(AUTHENTICATED_USER)
  }

  getAuthenticatedToken() {
    if (this.getAuthenticatedUser()) {
      return sessionStorage.getItem(TOKEN)
    }
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem(AUTHENTICATED_USER);
    return !(user === null)
  }

  logout() {
    sessionStorage.removeItem(AUTHENTICATED_USER);
    sessionStorage.removeItem(TOKEN);
  }

}

export class AuthenticationBean {
  constructor(public message: string) { }
}

import { Injectable } from '@angular/core';
import { API_URL } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { Company } from '../common/company';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  get(email: string) {
    return this.http.get<Company>(`${API_URL}/company/${email}`);
  }

  register(company: Company) {
    return this.http.post(`${API_URL}/company/create`, company);
  }

  delete(email: string) {
    return this.http.delete(`${API_URL}/company/${email}`);
  }

  put(email: string, company: Company) {
    return this.http.put(`${API_URL}/company/${email}`, company);
  }

  updatePhoto(email: string, image: any) {
    return this.http.put(`${API_URL}/company/${email}/photo`, image);
  }
}

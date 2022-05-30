import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../app.constants';
import { Company } from '../common/company';
import { Posting } from '../common/posting';
import { Category } from '../common/category';

@Injectable({
  providedIn: 'root'
})
export class PostingService {

  constructor(private http: HttpClient) { }

  postJob(posting: Posting) {
    return this.http.post(`${API_URL}/posting/create`, posting);
  }

  get(id: number) {
    return this.http.get(`${API_URL}/postings/${id}`);
  }

  getByLocalization(localization: string) {
    return this.http.get(`${API_URL}/postings/search/findByLocalizationContaining?localization=${localization}`);
  }

  getByLanguage(requirement: string) {
    return this.http.get(`${API_URL}/postings/search/findByRequirementContaining?requirement=${requirement}`);
  }

  getByCategory(categoryId: number) {
    return this.http.get(`${API_URL}/postings/search/findByPostingCategoryId?id=${categoryId}`);
  }

  getCategory(id: number) {
    return this.http.get<Category>(`${API_URL}/postings/${id}/postingCategory`);
  }

  getAll() {
    return this.http.get(`${API_URL}/postings`);
  }

  getAllPostingsForCompany(email: string) {
    return this.http.get(`${API_URL}/postings/search/findByEmail?email=${email}`)
  }

  getAllPostingCategories() {
    return this.http.get(`${API_URL}/postingCategories`)
  }

  deletePosting(id: number) {
    return this.http.delete(`${API_URL}/posting/delete/${id}`)
  }

  editPosting(id: number, posting: Posting) {
    return this.http.put(`${API_URL}/posting/${id}`, posting)
  }
}

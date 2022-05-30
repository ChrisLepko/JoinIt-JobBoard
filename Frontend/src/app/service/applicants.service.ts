import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class ApplicantsService {

  constructor(private http: HttpClient) { }

  getApplicantsList(companyEmail: string){
    return this.http.get(`${API_URL}/applicants/search/findByCompanyEmailContaining?companyEmail=${companyEmail}`)
  }

  uploadPdfToDatabase(pdf: any, pdfName: string, companyEmail: string, nameSurname: string){
    return this.http.post(`${API_URL}/managepdf/uploadPdf?pdfName=${pdfName}&companyEmail=${companyEmail}&nameSurname=${nameSurname}`, pdf);
  }

  downloadCV(applicantEmail: string): any{
    return this.http.get(`${API_URL}/managepdf/readPdfFile?pdfName=${applicantEmail}`, {responseType: 'blob'})
  }

  // inspectCV(applicantEmail: string): any{
  //   return this.http.get(`${API_URL}/managepdf/readPdfFile?pdfName=${applicantEmail}`, {responseType: 'blob'})
  // }

}

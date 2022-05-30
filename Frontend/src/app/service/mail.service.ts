import { Injectable } from '@angular/core';
import { API_URL } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { Mail } from '../common/mail';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient) { }

  sendEmail(pdf: any, companyEmail: string, appliedEmail: string, firstAndLastName: string, introduction: string, companyName: string, localization: string, positionName: string) {
    return this.http.post(`${API_URL}/email/send?to=${companyEmail}&appliedEmail=${appliedEmail}&firsAndLastName=${firstAndLastName}&introduction=${introduction}&companyName=${companyName}
    &localization=${localization}&positionName=${positionName}`, pdf);
  }

  uploadPdfToDatabase(pdf: any, pdfName: string, companyEmail: string, nameSurname: string){
    return this.http.post(`${API_URL}/managepdf/uploadPdf?pdfName=${pdfName}&companyEmail=${companyEmail}&nameSurname=${nameSurname}`, pdf);
  }

  getQueueMessage(){
    return this.http.get(`${API_URL}/email/getMessage`)
  }

  addQueueComment(companyName: any, comment: any){
    return this.http.post(`${API_URL}/managequeues/addMessage?companyName=${companyName}&comment=${comment}`, null)
  }

  getQueueComment(companyName){
    return this.http.get(`${API_URL}/managequeues/getQueueComment?companyName=${companyName}`)
  }
}

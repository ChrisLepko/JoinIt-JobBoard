import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Posting } from '../common/posting';
import { Applicants } from '../common/applicants';
import { PostingService } from '../service/posting.service';
import { UserService } from '../service/user.service';
import { ApplicantsService } from '../service/applicants.service'
import { AUTHENTICATED_USER } from '../app.constants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-applicants-list',
  templateUrl: './applicants-list.component.html',
  styleUrls: ['./applicants-list.component.css']
})
export class ApplicantsListComponent implements OnInit {

  applicants: Applicants[] = [];
  firstLoaded: Promise<boolean>


  constructor(private postingService: PostingService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private route: ActivatedRoute,
    private applicantService: ApplicantsService) { }

  ngOnInit(): void {

    this.handleApplicants();

  }


  processResultForApplicants() {
    this.spinner.show();

    return data => {
      this.applicants = data._embedded.applicantses;


      this.firstLoaded = Promise.resolve(true);


      setTimeout(() => {
        /** spinner ends after 1 seconds */
        this.spinner.hide();
      }, 1000);
    }
  }

  handleApplicants(){
    this.applicantService.getApplicantsList(sessionStorage.getItem(AUTHENTICATED_USER)).subscribe(this.processResultForApplicants())
  }

  downloadCV(applicantEmail){

    this.applicantService.downloadCV(applicantEmail).subscribe(
      data =>{
        saveAs(data, applicantEmail + " - CV.pdf")
      }
    )
  }

  inspectCV(applicantEmail){

    this.applicantService.downloadCV(applicantEmail).subscribe(
      data =>{

        const newBlob = new Blob([data], {type: "application/pdf"});
        const newWindow = window.open('', "CV - Preview", "width=800,height=1200");
    if (newWindow) {
        setTimeout( () => {
            const dataUrl = window.URL.createObjectURL(newBlob);
            const title = newWindow.document.createElement('title');
            const iframe = newWindow.document.createElement('iframe');

            title.appendChild(document.createTextNode("CV - Preview"));
            newWindow.document.head.appendChild(title);

            iframe.setAttribute('src', dataUrl);
            iframe.setAttribute('width', "100%");
            iframe.setAttribute('height', "100%");

            newWindow.document.body.appendChild(iframe);

            setTimeout( () => {
                window.URL.revokeObjectURL(dataUrl);
            }, 100);
        }, 100);
    } else {
        alert("To display reports, please disable any pop-blockers for this page and try again.");
    }
      }
    )
  }

}

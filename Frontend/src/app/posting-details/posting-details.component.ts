import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Posting } from '../common/posting';
import { PostingService } from '../service/posting.service';
import { MailService } from '../service/mail.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-posting-details',
  templateUrl: './posting-details.component.html',
  styleUrls: ['./posting-details.component.css']
})
export class PostingDetailsComponent implements OnInit {
  posting: Posting = new Posting();
  applyForm: FormGroup;
  fileToUpload: File;
  loading = false;
  submitted = false;
  savePdf = false;
  comment: string;
  commentForm: FormGroup;



  constructor(private postingService: PostingService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private mailService: MailService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getValues();
    });

    this.applyForm = this.formBuilder.group({
      firstAndLastName: ['', Validators.required],
      email: ['', Validators.required],
      introduction: ['', Validators.required],
      pdfFile: ['', Validators.required]
    });

    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required] 
    })
  }

  addComment(){

    this.spinner.show()

    this.commentForm = this.formBuilder.group({
      comment: [this.comment, Validators.required],
      companyName: [this.posting.companyName, Validators.required]
    })

    if(this.commentForm.invalid){
      this.toastr.error('Form is invalid!');
      this.spinner.hide();
    }


    this.mailService.addQueueComment(this.posting.companyName, this.g.comment.value).pipe(first()).subscribe(
      data => {
        this.toastr.success('Comment added successfully')
        this.spinner.hide()
        let closeButton = document.getElementById('closeButton');
        closeButton.click();
      },
      error => {
        if(error.status == 200){
          this.toastr.success('Comment added successfully')
          this.spinner.hide()
          let closeButton = document.getElementById('closeButton');
          closeButton.click();
        } else {
          this.toastr.error(error);
          this.spinner.hide()
        }
      }
    )
  }

  getValues() {
    this.spinner.show();
    const id: number = +this.route.snapshot.paramMap.get('id');
    this.postingService.get(id).subscribe(this.processResultForPostings());
  }

  processResultForPostings() {
    this.spinner.show();
    const id: number = +this.route.snapshot.paramMap.get('id');

    return data => {
      this.posting = data;
      this.postingService.getCategory(id).subscribe(
        data => {
          this.posting.postingCategory = data.categoryName;

        }
      )

      this.spinner.hide();
      console.log(this.posting)
      setTimeout(() => {
        /** spinner ends after 2 seconds */
        this.spinner.hide();
      }, 2000);
    }
  }


  get f() { return this.applyForm.controls; }
  get g() { return this.commentForm.controls}


  public onFileChanged(event) {
    this.fileToUpload = event.target.files[0];
  }

  sendEmail() {
    this.submitted = true;

    this.toastr.warning('Sending Application...', "Sending Application" ,{
      timeOut: 15500,
      progressBar: true,
      progressAnimation: 'increasing'
    });

    const formData: FormData = new FormData();
    formData.append('pdfFile', this.fileToUpload, this.fileToUpload.name);
    this.f.pdfFile.setValue(this.fileToUpload);

    if (this.applyForm.invalid) {
      this.toastr.warning('Form is invalid!');
      this.spinner.hide();
    }
    else {
      this.loading = true;
      this.mailService.sendEmail(formData, this.posting.email, this.f.email.value, this.f.firstAndLastName.value, this.f.introduction.value, this.posting.companyName,
        this.posting.localization, this.posting.positionName)
        .pipe(first())
        .subscribe(
          data => {

            if(this.savePdf){
              this.mailService.uploadPdfToDatabase(formData, this.f.email.value, this.posting.email, this.f.firstAndLastName.value).pipe(first()).subscribe(
                pdfData => {
                  this.toastr.success('Success!');
                  setTimeout(() => {
                    this.router.navigate(['/board']);
                  }, 1000)
                },
                error => {
                  if(error.status == 200){
                    this.mailService.getQueueMessage().subscribe(
                      messageData => {
                        console.log("DUPA")
                        console.log(messageData);
                        this.toastr.success('Success!');
                        setTimeout(() => {
                          this.router.navigate(['/board']);
                        }, 1000)
                      },
                      error =>{
                        if(error.status == 200){
                          console.log(error.error.text);
                          this.toastr.success('Application sent!');
                          setTimeout(() => {
                            this.router.navigate(['/board']);
                          }, 1500)
                        }else{
                          this.toastr.error(error);
                        }
                      }
                    )
                  }else{
                    this.toastr.error(error);
                  }
                }
              )
            } else {
              this.toastr.success('Success!');
              setTimeout(() => {
                this.router.navigate(['/board']);
              }, 1000)
            }
          },
          error => {
            this.toastr.error(error);
          });
    }
  }
}

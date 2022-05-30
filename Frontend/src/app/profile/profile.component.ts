import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AUTHENTICATED_USER } from '../app.constants';
import { Company } from '../common/company';
import { BasicAuthenticationService } from '../service/basic-authentication.service';
import { MailService } from '../service/mail.service';
import { PostingService } from '../service/posting.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public selectedFile;
  public event1;
  imgURL: any = "";
  receivedImageData: any;
  base64Data: any;
  convertedImage: any;
  imageId: any;

  name: string;
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: number;
  password: string;
  pic: any;
  comment: string = "Click next to display comment";

  updateForm: FormGroup;

  constructor(private userService: UserService,
    private basicAuthenticationService: BasicAuthenticationService,
    private postingService: PostingService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private mailService: MailService) {
  }

  ngOnInit(): void {
    this.userService.get(sessionStorage.getItem(AUTHENTICATED_USER)).subscribe(data => {
      this.name = data.name
      this.firstName = data.firstName
      this.surname = data.surname
      this.email = data.email
      this.phoneNumber = data.phoneNumber
      this.password = data.password
      this.pic = data.pic;
    });


    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required, Validators.minLength(6)]
    });
  }

  viewComment(){
    this.mailService.getQueueComment(this.name).subscribe(
      data => {
      },
      error => {
        if(error.status == 200){
          this.comment = error.error.text
        }

        if(error.status == 500){
          this.comment = "No more comments to display"
        }
      }
    )
  }

  updateUser() {
    this.spinner.show();

    const uploadData = new FormData();

    if (this.imgURL != "") {
      uploadData.append('newCompany', this.selectedFile, this.selectedFile.name)
    }

    this.updateForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      firstName: [this.firstName, Validators.required],
      surname: [this.surname, Validators.required],
      email: [this.email, Validators.required],
      phoneNumber: [this.phoneNumber, Validators.required],
      password: [this.password, Validators.required]
    });

    if (this.updateForm.invalid) {
      this.toastr.error('Form is invalid!');
      this.spinner.hide();
    }
    else if (this.updateForm.controls['email'].value === ' ') {
      this.toastr.error('Nice try ;)');
      this.spinner.hide();
    }
    else if (this.password.length < 6) {
      this.toastr.error('Password must have more than 6 characters');
      this.spinner.hide();
    }
    else {
      this.userService.put(this.email, this.updateForm.value)
        .pipe(first())
        .subscribe(
          data => {
            if (this.imgURL != "") {
              this.userService.updatePhoto(this.email, uploadData).subscribe(
                data => {
                  window.location.reload();
                  this.toastr.success('Update successful');
                  this.spinner.hide();
                },
                error => {
                  this.toastr.warning('Update error');
                  this.spinner.hide();
                }

              )
            }
            else {
              this.toastr.success('Update successful');
              this.spinner.hide();
            }
          },
          error => {
            this.toastr.error('Update error');
            this.spinner.hide();
          });
    }
  }

  public onFileChanged(event) {
    this.selectedFile = event.target.files[0];

    //display selected image
    if (this.selectedFile != undefined) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event2) => {
        this.imgURL = reader.result;
      }
    } else {
      this.imgURL = undefined;
    }
  }

  clickLabel() {
    let label = document.getElementById("add");
    label.click();
  }

  deleteAccount() {
    this.spinner.show();
    this.userService.delete(this.email).subscribe(
      data => {
        this.postingService.getAllPostingsForCompany(this.email).subscribe(
          data => {
            const tempData = data['_embedded']['postings'];
            for (let index = 0; index < tempData.length; index++) {
              this.postingService.deletePosting(tempData[index].id).subscribe(
                data => {},
                error => {
                  this.toastr.error("Error occured");
                  this.spinner.hide();
                }
              )
            }
            this.basicAuthenticationService.logout();
            this.router.navigate(["/board"]);
            this.toastr.success("Account deleted");
            this.spinner.hide();
          },
          error => {
            this.toastr.error("Error occured");
            this.spinner.hide();
          }
        )
      },
      error => {
        this.toastr.error("Error occured");
        this.spinner.hide();
      }
    )
  }

  deleteAllUserPostings(){
    this.postingService.getAllPostingsForCompany(this.email).subscribe(
      data => {
        const tempData = data['_embedded']['postings'];
        for (let index = 0; index < tempData.length; index++) {
          this.postingService.deletePosting(tempData[index].id).subscribe(
            data => {},
            error => {
              this.toastr.error("Error occured");
              this.spinner.hide();
            }
          )
        }
      },
      error => {
        this.toastr.error("Error occured");
        this.spinner.hide();
      }
    )
  }
}

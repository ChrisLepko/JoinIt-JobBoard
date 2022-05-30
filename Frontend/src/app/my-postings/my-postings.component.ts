import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AUTHENTICATED_USER } from '../app.constants';
import { Posting } from '../common/posting';
import { PostingService } from '../service/posting.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-my-postings',
  templateUrl: './my-postings.component.html',
  styleUrls: ['./my-postings.component.css']
})
export class MyPostingsComponent implements OnInit {

  postings: Posting[] = [];
  pics: any[] = [];

  constructor(private postingService: PostingService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    const email = sessionStorage.getItem(AUTHENTICATED_USER);
    this.postingService.getAllPostingsForCompany(email).subscribe(this.processResultForPostings())
  }

  getPictures() {
    for (let index = 0; index < this.postings.length; index++) {
      this.userService.get(this.postings[index].email).subscribe(data => {
        this.pics.push(data.pic)
      });
    }
  }

  processResultForPostings() {
    this.spinner.show();

    return data => {
      this.postings = data._embedded.postings;

      for (let index = 0; index < this.postings.length; index++) {
        this.userService.get(this.postings[index].email).subscribe(data => {
          this.postings[index].pic = data.pic;
        })
      }

      console.log(this.postings)
      this.spinner.hide();
    }
  }

  deletePosting(id: number) {
    this.spinner.show();
    this.postingService.deletePosting(id).subscribe(
      data => {
        this.toastr.success("Posting deleted")
        setTimeout(() => {
          /** spinner ends after 2 seconds */
          window.location.reload();
          this.spinner.hide();
        }, 1000);
      },
      error => {
        this.toastr.error("Error ocurred!");
        this.spinner.hide();
      }
    )
  }

}

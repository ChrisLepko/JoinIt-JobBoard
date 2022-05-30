import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Posting } from '../common/posting';
import { PostingService } from '../service/posting.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-job-postings',
  templateUrl: './job-postings.component.html',
  styleUrls: ['./job-postings.component.css']
})
export class JobPostingsComponent implements OnInit {
  postings: Posting[] = [];
  pics: any[] = [];
  tempRequirementsArray: any[] = [];
  testArray: any[] = [];
  firstLoaded: Promise<boolean>
  refreshed = false;

  currentLocalization: string;
  currentLanguage: string;
  currentCategory: string;


  constructor(private postingService: PostingService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('foo')
    }


    this.route.paramMap.subscribe(() => {
      this.handlePostingList();
    });

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

      console.log(this.postings)

      this.firstLoaded = Promise.resolve(true);

      for (let index = 0; index < this.postings.length; index++) {
        this.tempRequirementsArray.push(data._embedded.postings[index].requirement.slice(0, -1).split(','));
      }

      for (let index = 0; index < this.postings.length; index++) {
        this.userService.get(this.postings[index].email).subscribe(data => {
          this.postings[index].pic = data.pic;
        })
      }

      setTimeout(() => {
        /** spinner ends after 1 seconds */
        this.spinner.hide();
      }, 1000);
    }
  }

  handlePostingList() {
    const localization: boolean = this.route.snapshot.paramMap.has('localization');
    const requirement: boolean = this.route.snapshot.paramMap.has('requirement');
    const category: boolean = this.route.snapshot.paramMap.has('category');

    if (localization) {
      this.currentLocalization = this.route.snapshot.paramMap.get('localization');
      this.postingService.getByLocalization(this.currentLocalization).subscribe(this.processResultForPostings());
    }
    else if (requirement) {
      this.currentLanguage = this.route.snapshot.paramMap.get('requirement');
      this.postingService.getByLanguage(this.currentLanguage).subscribe(this.processResultForPostings());
    }
    else if (category) {
      let categoryId;
      this.currentCategory = this.route.snapshot.paramMap.get('category');

      switch (this.currentCategory) {
        case "Backend": {
          categoryId = 1; break;
        }
        case "Frontend": {
          categoryId = 2; break;
        }
        case "Fullstack": {
          categoryId = 3; break;
        }
        case "DevOps": {
          categoryId = 4; break;
        }
        case "Analyst": {
          categoryId = 5; break;
        }
        case "Support": {
          categoryId = 6; break;
        }
      }
      this.postingService.getByCategory(categoryId).subscribe(this.processResultForPostings());
    }
    else {
      this.postingService.getAll().subscribe(this.processResultForPostings())
    }
  }
}
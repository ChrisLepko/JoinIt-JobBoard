import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AUTHENTICATED_USER } from '../app.constants';
import { PostingService } from '../service/posting.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-posting-edit',
  templateUrl: './posting-edit.component.html',
  styleUrls: ['./posting-edit.component.css']
})
export class PostingEditComponent implements OnInit {

  postingForm: FormGroup
  loading = false;
  submitted = false;
  dropdownList = [];
  requirements = [];
  dropdownSettings = {};

  emailValue: string;
  tempCompanyName: string = "";
  tempPositionName: string = "";
  tempCategoryName: string = "";
  tempRequirements: string = "";
  tempRequirementsArray: any[] = [];
  tempLocalization: string = "";
  tempDescription: string = "";
  tempMinSalary: number = 0;
  tempMaxSalary: number = 0;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private postingService: PostingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
      this.getValues();
    });

    this.emailValue = sessionStorage.getItem(AUTHENTICATED_USER);

    this.userService.get(this.emailValue).subscribe(data => {

      this.tempCompanyName = data.name;
    });

    this.postingForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      email: [this.emailValue, Validators.required],
      positionName: ['', Validators.required],
      category: ['', Validators.required],
      requirements: ['', Validators.required],
      localization: ['', Validators.required],
      description: ['', Validators.required],
      minSalary: ['', Validators.required],
      maxSalary: ['', Validators.required]
    });

    this.dropdownList = [
      'Java',
      'C#',
      'JavaScript',
      'Python',
      'Swift',
      'Kotlin',
      'C++',
      'PHP'
    ];
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'Deselect All',
      itemsShowLimit: 7,
      allowSearchFilter: true
    };
  }

  // convenience getter for easy access to form fields
  get f() { return this.postingForm.controls; }


  putJob() {

    const id: number = +this.route.snapshot.paramMap.get('id');

    this.postingForm = this.formBuilder.group({
      companyName: [this.tempCompanyName, Validators.required],
      email: [this.emailValue, Validators.required],
      positionName: [this.tempPositionName, Validators.required],
      category: [this.tempCategoryName, Validators.required],
      requirements: [this.tempRequirementsArray, Validators.required],
      localization: [this.tempLocalization, Validators.required],
      description: [this.tempDescription, Validators.required],
      minSalary: [this.tempMinSalary, Validators.required],
      maxSalary: [this.tempMaxSalary, Validators.required]
    })

    this.spinner.show();
    this.submitted = true;



    // // stop here if form is invalid
    if (this.postingForm.invalid) {
      this.toastr.warning('Form is invalid!');
      this.spinner.hide();
    }
    else {

      this.loading = true;
      this.postingService.editPosting(id, this.postingForm.value)
        .pipe(first())
        .subscribe(
          data => {
            this.spinner.hide();
            this.toastr.success('Job posting edited');
            this.router.navigate(['/my-postings']);
          },
          error => {
            if (error.status == 200) {
              this.spinner.hide();
              this.toastr.success('Job posting edited');
              this.router.navigate(['/my-postings']);
            }
            else {
              this.toastr.error(error);
              this.spinner.hide();
            }

          });
    }
  }

  onItemSelect(item: any) {
    this.requirements = item;
  }
  onSelectAll(items: any) {
    this.requirements = items;
  }

  getValues() {
    const id: number = +this.route.snapshot.paramMap.get('id');
    this.postingService.get(id).subscribe(this.processResultForPostings());
  }

  processResultForPostings() {
    this.spinner.show();
    const id: number = +this.route.snapshot.paramMap.get('id');

    return data => {
      this.tempPositionName = data.positionName;
      this.tempRequirements = data.requirement;
      this.tempRequirementsArray = data.requirement.slice(0, -1).split(',');
      this.tempLocalization = data.localization;
      this.tempDescription = data.description;
      this.tempMinSalary = data.minSalary;
      this.tempMaxSalary = data.maxSalary;
      this.postingService.getCategory(id).subscribe(
        data => {
          this.tempCategoryName = data.categoryName;

        }
      )

      setTimeout(() => {
        /** spinner ends after 2 seconds */
        this.spinner.hide();
      }, 1000);
    }
  }

}

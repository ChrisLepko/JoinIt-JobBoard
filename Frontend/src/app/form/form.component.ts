import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { UserService } from '../service/user.service';
import { PostingService } from '../service/posting.service';
import { AUTHENTICATED_USER } from '../app.constants';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  postingForm: FormGroup
  loading = false;
  submitted = false;
  dropdownList = [];
  requirements = [];
  dropdownSettings = {};

  emailValue: string;
  tempCompanyName: string = "";



  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private postingService: PostingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.emailValue = sessionStorage.getItem(AUTHENTICATED_USER);


    this.userService.get(this.emailValue).subscribe(data => {

      this.tempCompanyName = data.name;
      console.log(data);
      console.log(this.tempCompanyName)
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

    this.spinner.hide();
  }

  // convenience getter for easy access to form fields
  get f() { return this.postingForm.controls; }


  postJob() {

    this.postingForm.controls['companyName'].setValue(this.tempCompanyName)

    this.spinner.show();
    this.submitted = true;

    //console.log(this.postingForm.value)

    // // stop here if form is invalid
    if (this.postingForm.invalid) {
      this.toastr.warning('Form is invalid!');
      this.spinner.hide();
    }
    else {

      this.loading = true;
      this.postingService.postJob(this.postingForm.value)
        .pipe(first())
        .subscribe(
          data => {
            this.spinner.hide();
            this.toastr.success('Job posting made');
            this.router.navigate(['/board']);
          },
          error => {
            this.toastr.error(error);
            this.spinner.hide();
          });
    }
  }

  onItemSelect(item: any) {
    this.requirements = item;
  }
  onSelectAll(items: any) {
    this.requirements = items;
  }

}

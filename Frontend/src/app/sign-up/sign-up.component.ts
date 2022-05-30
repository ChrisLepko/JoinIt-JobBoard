import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      firstName: [''],
      surname: [''],
      email: ['', Validators.required],
      phoneNumber: [''],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.spinner.show();
    this.submitted = true;

    console.log(this.registerForm.value)

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.toastr.warning('Form is invalid!');
      this.spinner.hide();
    }
    else {
      this.loading = true;
      this.userService.register(this.registerForm.value)
        .pipe(first())
        .subscribe(
          data => {
            this.spinner.hide();
            this.toastr.success('Registration successful');
            this.router.navigate(['/login']);
          },
          error => {
            this.toastr.error(error);
            this.spinner.hide();
          });
    }
  }
}

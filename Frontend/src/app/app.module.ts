import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { TagInputModule } from 'ngx-chips';
import { AppRoutingModule } from './app-routing';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { JobPostingsComponent } from './job-postings/job-postings.component';
import { PostingDetailsComponent } from './posting-details/posting-details.component';
import { JobBoardComponent } from './job-board/job-board.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProfileComponent } from './profile/profile.component';
import { FormComponent } from './form/form.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpIntercepterBasicAuthService } from './service/http/http-intercepter-basic-auth.service'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MyPostingsComponent } from './my-postings/my-postings.component';
import { PostingEditComponent } from './posting-edit/posting-edit.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApplicantsListComponent } from './applicants-list/applicants-list.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    PageHeaderComponent,
    JobPostingsComponent,
    PostingDetailsComponent,
    JobBoardComponent,
    LoginComponent,
    SignUpComponent,
    ProfileComponent,
    FormComponent,
    NotFoundComponent,
    MyPostingsComponent,
    PostingEditComponent,
    ApplicantsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TagInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialFileInputModule,
    MatIconModule,
    MatFormFieldModule,
    FeatherModule.pick(allIcons),
    HttpClientModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule
  ],
  exports: [
    FeatherModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpIntercepterBasicAuthService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

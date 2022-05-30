import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form/form.component';
import { JobBoardComponent } from './job-board/job-board.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PostingDetailsComponent } from './posting-details/posting-details.component';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RouteGuardService } from './service/route-guard.service'
import { MyPostingsComponent } from './my-postings/my-postings.component';
import { PostingEditComponent } from './posting-edit/posting-edit.component';
import { ApplicantsListComponent } from './applicants-list/applicants-list.component';


const routes: Routes = [
  {
    path: "posting-details/:id",
    component: PostingDetailsComponent
  },
  {
    path: "board",
    component: JobBoardComponent
  },
  {
    path: "board/localization/:localization",
    component: JobBoardComponent
  },
  {
    path: "board/category/:category",
    component: JobBoardComponent
  },
  {
    path: "board/language/:requirement",
    component: JobBoardComponent
  },
  {
    path: "form",
    component: FormComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: "applicants",
    component: ApplicantsListComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: "my-postings",
    component: MyPostingsComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: "my-postings/:id",
    component: PostingEditComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "sign-up",
    component: SignUpComponent
  },
  {
    path: "404",
    component: NotFoundComponent
  },
  {
    path: "",
    redirectTo: "/board",
    pathMatch: "full"
  },
  {
    path: "**",
    redirectTo: "404"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

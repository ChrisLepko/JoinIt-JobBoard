import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AUTHENTICATED_USER } from 'src/app/app.constants';
import { BasicAuthenticationService } from 'src/app/service/basic-authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  name: string = "";
  email: string = "";
  pic: any;

  constructor(private basicAuthenticationService: BasicAuthenticationService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    if (this.IsUserLoggedIn) {
      this.userService.get(sessionStorage.getItem(AUTHENTICATED_USER)).subscribe(data => {
        this.name = data.name;
        this.email = data.email;
        this.pic = data.pic;
      });
    }
  }

  IsUserLoggedIn() {
    return this.basicAuthenticationService.isUserLoggedIn();
  }

  logout() {
    this.basicAuthenticationService.logout();
    this.router.navigate(['/login']);
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';  // ← путь к auth.service.ts

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedState: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.loggedState = isLoggedIn;
      console.log('State has been changed: ' + isLoggedIn);
    });
  }

  login() {
    this.authService.logIn();
  }

  logout() {
    this.authService.logOut();
  }
}

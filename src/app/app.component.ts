import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Minesweeper';
  page = 'main';
  loggedInUser?: firebase.default.User | null;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.isUserLoggedIn().subscribe(user => {
      this.loggedInUser = user;
      localStorage.setItem('user', JSON.stringify(this.loggedInUser));
    }, error => {
      console.error(error);
      localStorage.setItem('user', JSON.stringify('null'));
    });
  }

  onToggleSidenav(sidenav: MatSidenav){
    console.log('Toggle')
    sidenav.toggle();
  }

  onClose(event: any, sidenav: MatSidenav){
    console.log('Close')
    if(event === true){
      sidenav.close()
    }
    
  }

  logout(_?: boolean){
    this.authService.logout().then(() => {
      console.log('Logged out successfully')
    }).catch(err =>{
      console.error(err);
    });
  }
 
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() loggedInUser?: firebase.default.User | null;
  @Output() onCloseSidenav: EventEmitter<boolean> = new EventEmitter();
  @Output() onLogout: EventEmitter<boolean> = new EventEmitter();

  close(logout?: boolean){
    this.onCloseSidenav.emit(true);
    if(logout){
      this.onLogout.emit(true);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeOverlayComponent } from './welcome-overlay/welcome-overlay.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    if(localStorage.firstTimeUser != 'true') {
      this.dialog.open(WelcomeOverlayComponent, {
        width: '500px'
      });
      localStorage.setItem('firstTimeUser', 'true')
    }
  }
}

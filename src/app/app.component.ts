import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeOverlayComponent } from './welcome-overlay/welcome-overlay.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { version } from 'src/changelog';

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

    // If the version in localStorage, doesn't match the current version
    // And the user isn't a first time user, open the changelog
    if(localStorage.version != String(version) && localStorage.firstTimeUser == 'true') {
      this.dialog.open(ChangelogComponent, {
        width: '500px'
      })
      localStorage.setItem('version', String(version));
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { changelog, IChangelogItem } from "../../changelog";

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent implements OnInit {
  changelog: IChangelogItem[];
  newestVersion: IChangelogItem;

  constructor() { }

  ngOnInit() {
    this.changelog = changelog
    this.newestVersion = this.changelog[this.changelog.length-1]
  }

}

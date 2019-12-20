import { Component, OnInit, ContentChildren, QueryList, AfterViewInit } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-tool-selection',
  templateUrl: './tool-selection.component.html',
  styleUrls: ['./tool-selection.component.scss']
})
export class ToolSelectionComponent implements OnInit, AfterViewInit {
  @ContentChildren(MatButton) matButtons: QueryList<MatButton>; // Get all matButtons in the NgContent
  buttonElms: HTMLButtonElement[]; // Map the matButtons to HTMLButtonElements by getting the nativeElement

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.buttonElms = this.matButtons.toArray().map(button => button._elementRef.nativeElement); // Map to HTMLButtonElements
    this.buttonElms.forEach(button => {button.onclick = () => {console.log(button.value ? button.value : '')}});
  } // console.log(button.value ? button.value : '')

}

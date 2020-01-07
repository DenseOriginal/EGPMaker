import { Component, OnInit, ContentChildren, QueryList, AfterViewInit, Output, Input, EventEmitter } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-tool-selection',
  templateUrl: './tool-selection.component.html',
  styleUrls: ['./tool-selection.component.scss']
})
export class ToolSelectionComponent implements OnInit, AfterViewInit {
  @ContentChildren(MatButton) matButtons: QueryList<MatButton>; // Get all matButtons in the NgContent
  buttonElms: HTMLButtonElement[]; // Map the matButtons to HTMLButtonElements by getting the nativeElement

  @Output() toolChange = new EventEmitter(); // The toolChange emitter

  // If a starting value was set, find the button with that value and activate it
  _value;
  @Input() set value(newVal) {this._value = newVal; this.setSelectedTool(newVal);}; // A starting value
  get value() {return this._value};

  constructor() { }

  ngOnInit() {
  }

  buttonClickHandler(e: HTMLButtonElement) {
    this.buttonElms.forEach(button => { // Loop through the buttons
      button.classList.remove('active'); // Remove the active class
    });

    e.classList.add('active'); // Set the button that was clicked on to active

    this.toolChange.emit(e.value);
  }

  setSelectedTool(value) {
    if(!this.buttonElms) return;
    this.buttonElms.forEach(button => {
      if(button.value === value) this.buttonClickHandler(button); // If the Start value match the button value, set the button as activated
    })
  }

  ngAfterViewInit() {
    this.buttonElms = this.matButtons.toArray().map(button => button._elementRef.nativeElement); // Map to HTMLButtonElements
    this.buttonElms.forEach(button => {button.onclick = () => this.buttonClickHandler(button)}); // Set the button.onclick to the buttonClickHandler
  
    this.setSelectedTool(this.value);
  }

}

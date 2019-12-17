import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Tools } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-tool-selector',
  templateUrl: './tool-selector.component.html',
  styleUrls: ['./tool-selector.component.scss']
})
export class ToolSelectorComponent implements OnInit {
  selectedTool: Tools = 'cursor';
  @Output() toolChange = new EventEmitter<Tools>();

  constructor() { }

  ngOnInit() {
    this.toolChange.emit(this.selectedTool);
  }

}

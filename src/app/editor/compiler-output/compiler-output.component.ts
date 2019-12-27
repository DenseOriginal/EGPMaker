import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-compiler-output',
  templateUrl: './compiler-output.component.html',
  styleUrls: ['./compiler-output.component.scss']
})
export class CompilerOutputComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CompilerOutputComponent>,
    @Inject(MAT_DIALOG_DATA) public codes: string[] 
  ) { };

  onCloseClick() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

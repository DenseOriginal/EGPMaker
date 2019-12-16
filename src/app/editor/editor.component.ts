import { Component, OnInit, OnDestroy } from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  private p5;
  constructor() { }

  ngOnInit() {
    console.log('editor-init');
    this.createCanvas();
  }

  ngOnDestroy(): void {
    this.destroyCanvas();
    console.log('editor-destroy');
  }

  private createCanvas = () => {
    console.log('creating canvas');
    this.p5 = new p5(this.editorSketch);
  }

  private destroyCanvas = () => {
    console.log('destroying canvas');
    this.p5.noCanvas();
  }

  private editorSketch(p: any) {
    let tempObject = <any>{}

    p.setup = () => {
      p.createCanvas(window.innerWidth / 2.5, window.innerWidth / 2.5).parent('editor-canvas');
      p.angleMode(p.DEGREES);
      p.background(255, 175, 175);
    };

    p.draw = () => {
      if(tempObject.pos1) {
        if(tempObject.pos2) {
          p.rect(tempObject.pos1.x, tempObject.pos1.y, tempObject.pos2.x, tempObject.pos2.y);
        } else {
          p.rect(tempObject.pos1.x, tempObject.pos1.y, p.mouseX - tempObject.pos1.x, p.mouseY - tempObject.pos1.y)

        }
      }
    }

    p.mousePressed = () => {
      if(!tempObject.pos1) {
        tempObject.pos1 = {
          x: p.mouseX,
          y: p.mouseY
        }
      } else {
        tempObject = {};
        tempObject.pos1 = {
          x: p.mouseX,
          y: p.mouseY
        }
      }
    }

    p.mouseReleased = () => {
      tempObject.pos2 = {
        x: p.mouseX - tempObject.pos1.x,
        y: p.mouseY - tempObject.pos1.y
      }
      console.log(tempObject);
    }
  }

}


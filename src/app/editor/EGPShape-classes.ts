import * as p5 from "p5";
import { IPosition, IColor, IStyle } from '../shared/interfaces';

export type ShapeTypes = 'box' | 'poly' | 'ellipse'; // The different types of shapes

export class ShapeClass { // A base shapeClass that holds teh base information adbout a shape
    type: ShapeTypes;
    p: p5;
    pos: IPosition[] = [];
    color: IColor = { r: 255, g: 175, b: 175 };
    id: number;
    selected: boolean = false;
    style: IStyle = {}

    constructor(_type: ShapeTypes, p_: p5, id_: number) {
        this.type = _type;
        this.p = p_;
        this.id = id_
    }

    public getType(): string{
        return this.type;
    }

    public getId(): number {
        return this.id
    }

    public display() {};
    public compile(): string {return ''};
    public clicked(): boolean {return true};
    public addPos(newPos: IPosition) {};
    public setColor(newColor: IColor) {this.color = newColor;};
}

export namespace EGPObjects { // Namespace for all the different shapes
    export class box extends ShapeClass { // Box shape that extend the base shapeClass
        constructor(type_: ShapeTypes, p_: p5, id_: number) {
            super(type_, p_, id_);
        }

        display() { // Display function for box, that display the box 

            // Add object styling here

            
            // Fill the box the color it has
            this.p.fill(this.color.r, this.color.g, this.color.b);
            
            if(this.style.outline) {
                this.p.stroke(this.color.r, this.color.g, this.color.b);
                this.p.strokeWeight(4);
                this.p.noFill();
            } else {
                this.p.noStroke();
            }
            
            // If the object is selected outline it
            if(this.selected) {this.p.stroke(100, 100, 255);}
            
            // First check if it has a pos, if it doesn't have, don't draw anything
            if(this.pos[0]) {
                // Second check, if it has a pos and a widht and height
                if(this.pos[1]) {
                    // Draw the shape using the measuments in the class
                    this.p.rect(
                        this.pos[0].x,
                        this.pos[0].y,
                        this.pos[1].x,
                        this.pos[1].y
                    );
                } else {
                    // If it only has one position
                    // Draw the shape at the specified postion, and calculate the width and height
                    this.p.rect(
                        this.pos[0].x,
                        this.pos[0].y,
                        this.p.mouseX - this.pos[0].x,
                        this.p.mouseY - this.pos[0].y
                    );
                }
            }
        };
        compile() {return ''}; // Add a compile function here
        clicked() {
            // If the cursor is inside the shape return true;
            if(
                this.p.mouseX > this.pos[0].x && // If mouse.x is greater than the objects x cordinate
                this.p.mouseY > this.pos[0].y && // If mouse.y is greater than the objects y cordinate
                this.p.mouseX < this.pos[0].x + this.pos[1].x && // If mouse.x is less than the objects x cordinate plus the width
                this.p.mouseY < this.pos[0].y + this.pos[1].y // If mouse.y is less than the objects y cordinate plus the height
            ) return true; else return false;
        };
        addPos(newPos: IPosition) {
            // Add a new pos, limit the amount if positions to 2
            if(this.pos.length === 2 || this.pos.length > 2) return;
            this.pos.push(newPos);

            // If the array is filled with two position, check if the second pos is negative, and make it positive
            if(this.pos.length === 2){
                // If the width or height is negative, make it positive, and move the x/y back the correct amount
                if(this.pos[1].x < 0) { this.pos[0].x += this.pos[1].x; this.pos[1].x = Math.abs(this.pos[1].x) }
                if(this.pos[1].y < 0) { this.pos[0].y += this.pos[1].y; this.pos[1].y = Math.abs(this.pos[1].y) }
            };
        };
    };
};
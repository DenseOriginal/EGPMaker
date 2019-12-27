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
    style: IStyle = {};
    isComplete = false;

    constructor(_type: ShapeTypes, p_: p5, id_: number) {
        this.type = _type;
        this.p = p_;
        this.id = id_
    }

    public getType(): string {
        return this.type;
    }

    public getId(): number {
        return this.id
    }

    public display() { };
    public compile(index: number): string { return '' };
    public clicked(): boolean { return true };
    public addPos(newPos: IPosition) { };
    public setColor(newColor: IColor) { this.color = newColor; };
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

            if (this.style.outline) {
                this.p.stroke(this.color.r, this.color.g, this.color.b);
                this.p.strokeWeight(4);
                this.p.noFill();
            } else {
                this.p.noStroke();
            }

            // If the object is selected outline it
            if (this.selected) { this.p.stroke(100, 100, 255); }

            // First check if it has a pos, if it doesn't have, don't draw anything
            if (this.pos[0]) {
                // Second check, if it has a pos and a widht and height
                if (this.pos[1]) {
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
                        (this.p.keyCode === this.p.SHIFT ? this.p.mouseX - this.pos[0].x : this.p.mouseY - this.pos[0].y)
                    );
                }
            }
        };
        compile(index: number): string {
            const scale = (num, in_min, in_max, out_min, out_max) => {
                return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            }

            var scaledPos = [
                {
                    x: scale(this.pos[0].x, 0, this.p.width, 0, 512),
                    y: scale(this.pos[0].y, 0, this.p.width, 0, 512)
                },
                {
                    x: scale(this.pos[1].x, 0, this.p.width, 0, 512),
                    y: scale(this.pos[1].y, 0, this.p.width, 0, 512)
                }
            ];
            scaledPos = [
                {
                    x: Math.floor(scaledPos[0].x + scaledPos[1].x / 2),
                    y: Math.floor(scaledPos[0].y + scaledPos[1].y / 2)
                },
                {
                    x: Math.floor(scaledPos[1].x),
                    y: Math.floor(scaledPos[1].y)
                }
            ]

            const objectString = `EGP:egpBox${this.style.outline ? 'Outline' : ''}(${index + 1}, vec2(${scaledPos[0].x}, ${scaledPos[0].y}), vec2(${scaledPos[1].x}, ${scaledPos[1].y}))`
            const colorString = `EGP:egpColor(${index + 1}, vec3(${this.color.r}, ${this.color.g}, ${this.color.b}))`

            return objectString + ' ' + colorString;
        }; // Add a compile function here
        clicked() {
            // If the cursor is inside the shape return true;
            if (
                this.p.mouseX > this.pos[0].x && // If mouse.x is greater than the objects x cordinate
                this.p.mouseY > this.pos[0].y && // If mouse.y is greater than the objects y cordinate
                this.p.mouseX < this.pos[0].x + this.pos[1].x && // If mouse.x is less than the objects x cordinate plus the width
                this.p.mouseY < this.pos[0].y + this.pos[1].y // If mouse.y is less than the objects y cordinate plus the height
            ) return true; else return false;
        };
        addPos(newPos: IPosition) {
            // Add a new pos, limit the amount if positions to 2
            if (this.pos.length === 2 || this.pos.length > 2) return;
            this.pos.push({
                x: Math.floor(newPos.x),
                y: Math.floor(newPos.y)
            });

            // If the array is filled with two position, check if the second pos is negative, and make it positive
            if (this.pos.length === 2) {
                this.isComplete = true; // Set the shape as finished if it has to posistions

                // If the width or height is negative, make it positive, and move the x/y back the correct amount
                if (this.pos[1].x < 0) { this.pos[0].x += this.pos[1].x; this.pos[1].x = Math.abs(this.pos[1].x) }
                if (this.pos[1].y < 0) { this.pos[0].y += this.pos[1].y; this.pos[1].y = Math.abs(this.pos[1].y) }
            };
        };
    };

    // Ellipse shape, basicly the same code as box shape, but new display, clicked, compile function
    export class ellipse extends ShapeClass { // Ellipse shape that extend the base shapeClass
        constructor(type_: ShapeTypes, p_: p5, id_: number) {
            super(type_, p_, id_);
        }

        display() { // Display function for box, that display the box 

            // Add object styling here


            // Fill the box the color it has
            this.p.fill(this.color.r, this.color.g, this.color.b);

            if (this.style.outline) {
                this.p.stroke(this.color.r, this.color.g, this.color.b);
                this.p.strokeWeight(4);
                this.p.noFill();
            } else {
                this.p.noStroke();
            }

            // If the object is selected outline it
            if (this.selected) { this.p.stroke(100, 100, 255); }

            // First check if it has a pos, if it doesn't have, don't draw anything
            if (this.pos[0]) {
                // Second check, if it has a pos and a widht and height
                if (this.pos[1]) {
                    // Draw the shape using the measuments in the class
                    this.p.ellipse(
                        this.pos[0].x,
                        this.pos[0].y,
                        this.pos[1].x,
                        this.pos[1].y
                    );
                } else {
                    // If it only has one position
                    // Draw the shape at the specified postion, and calculate the width and height
                    this.p.ellipse(
                        this.pos[0].x,
                        this.pos[0].y,
                        this.p.mouseX - this.pos[0].x,
                        (this.p.keyCode === this.p.SHIFT ? this.p.mouseX - this.pos[0].x : this.p.mouseY - this.pos[0].y)
                    );
                }
            }
        };
        compile(index: number): string {
            const scale = (num, in_min, in_max, out_min, out_max) => {
                return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            }

            var scaledPos = [
                {
                    x: scale(this.pos[0].x, 0, this.p.width, 0, 512),
                    y: scale(this.pos[0].y, 0, this.p.width, 0, 512)
                },
                {
                    x: scale(this.pos[1].x, 0, this.p.width, 0, 512),
                    y: scale(this.pos[1].y, 0, this.p.width, 0, 512)
                }
            ];
            scaledPos = [
                {
                    x: Math.floor(scaledPos[0].x + scaledPos[1].x / 2),
                    y: Math.floor(scaledPos[0].y + scaledPos[1].y / 2)
                },
                {
                    x: Math.floor(scaledPos[1].x),
                    y: Math.floor(scaledPos[1].y)
                }
            ]

            const objectString = `EGP:egp${this.style.outline ? 'Outline' : ''}Circle(${index + 1}, vec2(${scaledPos[0].x}, ${scaledPos[0].y}), vec2(${scaledPos[1].x}, ${scaledPos[1].y}))`
            const colorString = `EGP:egpColor(${index + 1}, vec3(${this.color.r}, ${this.color.g}, ${this.color.b}))`

            return objectString + ' ' + colorString;
        }; // Add a compile function here
        clicked() {
            // https://www.geeksforgeeks.org/check-if-a-point-is-inside-outside-or-on-the-ellipse/

            // If the cursor is inside the shape return true;
            var h = this.pos[0].x + this.pos[1].x / 2;
            var k = this.pos[0].y + this.pos[1].y / 2;

            var a = this.pos[1].x / 2;
            var b = this.pos[1].y / 2;
            
            return ((Math.pow((this.p.mouseX - h), 2) / Math.pow(a, 2)) + (Math.pow((this.p.mouseY - k), 2) / Math.pow(b, 2)) <= 1)
        };
        addPos(newPos: IPosition) {
            this.isComplete = true; // Set the shape as finished if it has to posistions

            // Add a new pos, limit the amount if positions to 2
            if (this.pos.length === 2 || this.pos.length > 2) return;
            this.pos.push({
                x: Math.floor(newPos.x),
                y: Math.floor(newPos.y)
            });

            // If the array is filled with two position, check if the second pos is negative, and make it positive
            if (this.pos.length === 2) {
                // If the width or height is negative, make it positive, and move the x/y back the correct amount
                if (this.pos[1].x < 0) { this.pos[0].x += this.pos[1].x; this.pos[1].x = Math.abs(this.pos[1].x) }
                if (this.pos[1].y < 0) { this.pos[0].y += this.pos[1].y; this.pos[1].y = Math.abs(this.pos[1].y) }
            };
        };
    };
};
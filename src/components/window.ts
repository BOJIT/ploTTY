import template from './window.html';

export class Point {
    x = template;
    y = 10;
    scale(n: number): void {
        this.x *= n;
        this.y *= n;
    }
}

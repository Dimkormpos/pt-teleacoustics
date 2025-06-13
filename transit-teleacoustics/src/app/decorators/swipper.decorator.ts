import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[swipper]'
})
export class SwipperDecorator {
    @Output() swipedLeft = new EventEmitter<TouchEvent>();
    @Output() swipedRight = new EventEmitter<TouchEvent>();
    @Output() swipedUp = new EventEmitter<TouchEvent>();
    @Output() swipedDown = new EventEmitter<TouchEvent>();

    private touchStartX = 0;
    private touchStartY = 0;
    private threshold = 30; // Minimum distance in px to be considered a swipe

    constructor(private el: ElementRef) { }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent) {
        if (event.touches.length === 1) {
            this.touchStartX = event.touches[0].clientX;
            this.touchStartY = event.touches[0].clientY;
        }
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: TouchEvent) {
        if (event.changedTouches.length === 1) {
            const deltaX = event.changedTouches[0].clientX - this.touchStartX;
            const deltaY = event.changedTouches[0].clientY - this.touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > this.threshold) {
                    this.swipedRight.emit(event);
                } else if (deltaX < -this.threshold) {
                    this.swipedLeft.emit(event);
                }
            } else {
                if (deltaY > this.threshold) {
                    this.swipedDown.emit(event);
                } else if (deltaY < -this.threshold) {
                    this.swipedUp.emit(event);
                }
            }
        }
    }
}
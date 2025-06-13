import { Component } from '@angular/core';
import { SwipperDecorator } from '../../decorators/swipper.decorator';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prism-navigator',
  imports: [CommonModule, SwipperDecorator],
  templateUrl: './prism-navigator.component.html',
  styleUrl: './prism-navigator.component.css'
})
export class PrismNavigatorComponent {
  swippResult: BehaviorSubject<string> = new BehaviorSubject<string>('Swipe to navigate');
  firstTime: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor() {
    const firstTimeKey = 'prism-navigator-first-time';
    this.firstTime.next(localStorage.getItem(firstTimeKey) === null);
    if (this.firstTime.value) {
      localStorage.setItem(firstTimeKey, 'true'); // Set default value
    }
  }

  swipedRight() {
    this.swippResult.next('Swiped right');
    console.log('Swiped right');
  }
  swipeUp() {
    this.swippResult.next('Swiped up');
    console.log('Swiped up');
  }
  swipeLeft() {
    this.swippResult.next('Swiped left');
    console.log('Swiped left');
  }
  swipeDown() {
    this.swippResult.next('Swiped down');
    console.log('Swiped down');
  }

}

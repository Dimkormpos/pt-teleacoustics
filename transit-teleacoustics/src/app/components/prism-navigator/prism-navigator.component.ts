import { Component } from '@angular/core';
import { SwipperDecorator } from '../../decorators/swipper.decorator';

@Component({
  selector: 'app-prism-navigator',
  imports: [SwipperDecorator],
  templateUrl: './prism-navigator.component.html',
  styleUrl: './prism-navigator.component.css'
})
export class PrismNavigatorComponent {
  swipedRight() {
    console.log('Swiped right');
  }
  swipeUp() {
    console.log('Swiped up');
  }
  swipeLeft() {
    console.log('Swiped left');
  }
  swipeDown() {
    console.log('Swiped down');
  }

}

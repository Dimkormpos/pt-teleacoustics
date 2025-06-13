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
  activeMenu: MenuItem | null = null;
  activeDescription: BehaviorSubject<string> = new BehaviorSubject<string>('');
  menus: MenuItem[] = [
    {
      key: 'info',
      order: 0,
      description: 'Οδηγίες χρήσης. Επιλέξτε για να βρείτε πληροφορίες για το πώς να χρησιμοποιήσετε την εφαρμογή.'
    },
    {
      key: 'whereAmI',
      order: 1,
      description: 'Σε ποια στάση βρίσκομαι; Επιλέξτε για να βρείτε την τρέχουσα τοποθεσία σας και την στάση λεωφορείου στην οποία βρίσκεστε και να ακούσετε τα λεωφορία που περνάνε.'
    },
    {
      key: 'inputSpeach',
      order: 2,
      description: 'Εισαγωγή φωνής. Επιλέξτε για να εισάγετε φωνητικά το λεωφορείο που θέλετε να .'
    },
    {
      key: 'inputText',
      order: 3,
      description: 'Εισαγωγή κειμένου. Επιλέξτε για να εισάγετε κείμενο το λεωφορείο στην οποία θέλετε να πάτε.'
    },
    {
      key: 'nextStop',
      order: 4,
      description: 'Επόμενη στάση. Επιλέξτε για να ακούσετε την επόμενη στάση του λεωφορείου που βρίσκεστε.'
    },
  ]

  constructor() {
    const firstTimeKey = 'prism-navigator-first-time';
    this.activeMenu = this.menus[1]; // Set default active menu to the first one
    this.activeDescription.next(this.activeMenu.description);
    if (this.firstTime.value) {
      localStorage.setItem(firstTimeKey, 'true'); // Set default value
      this.activeMenu = this.menus[0];
    }

    this.activeDescription.next(this.activeMenu.description);
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

export interface MenuItem {
  key: string;
  order: number;
  description: string;
}
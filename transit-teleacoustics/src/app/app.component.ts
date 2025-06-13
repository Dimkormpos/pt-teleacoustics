import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseOptions, initializeApp } from 'firebase/app';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'transit-teleacoustics';


}

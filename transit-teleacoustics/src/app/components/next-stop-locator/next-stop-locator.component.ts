import { Component, OnInit } from '@angular/core';
import { OasaApiService } from '../../services/oasa-api.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-next-stop-locator',
  imports: [],
  templateUrl: './next-stop-locator.component.html',
  styleUrl: './next-stop-locator.component.css'
})
export class NextStopLocatorComponent implements OnInit{

  constructor(private oasaApiService: OasaApiService) {  
  }
  ngOnInit(): void {
    this.oasaApiService.webGetStops("2045").pipe(
      tap((z) => {
        console.log(z);
      })
    ).subscribe();
  }
}

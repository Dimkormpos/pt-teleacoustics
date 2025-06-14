import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OasaApiService, Route } from '../../services/oasa-api.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bus-waiting',
  imports: [CommonModule],
  templateUrl: './bus-waiting.component.html',
  styleUrl: './bus-waiting.component.css'
})
export class BusWaitingComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _oasaApi: OasaApiService,
  ) { }
  ngOnInit(): void {
    const routeCode = this._activatedRoute.snapshot.params['routeCode'];
    this._oasaApi.getBusLocation(routeCode).pipe(
      catchError((e: any) => {
        console.error(e);
        return EMPTY;
      }),
      tap(t => {
        console.log(t)
      }),
    ).subscribe();
  }

}

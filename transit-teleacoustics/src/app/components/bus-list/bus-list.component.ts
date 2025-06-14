import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OasaApiService, Route } from '../../services/oasa-api.service';
import { catchError, EMPTY, forkJoin, of, switchMap, tap } from 'rxjs';
import { Coordinates, LocationService } from '../../services/location.service';

@Component({
  selector: 'app-bus-list',
  imports: [CommonModule],
  templateUrl: './bus-list.component.html',
  styleUrl: './bus-list.component.css'
})
export class BusListComponent {
  protected buseRoutes: Route[] = [];
  protected myStationUi: string | undefined;
  protected myStationDistanceInMeters: number | undefined;

  private myStationCode: string | undefined;

  constructor(
    private _oasaApi: OasaApiService,
    private _locationApi: LocationService
  ) {
    _locationApi.getCurrentLocation().pipe(
      catchError((e: any) => {
        console.error(e);
        return EMPTY;
      }),
      switchMap((s: Coordinates) => {
        return forkJoin({
          coords: of(s),
          stop: _oasaApi.getNearestStop(s.latitude, s.longitude),
        })
      }),
      catchError((e: any) => {
        console.error(e);
        return EMPTY;
      }),
      tap(t => {
        const distanceKm = parseFloat(t.stop.distance);   // parse string to number (km)
        const distanceMeters = distanceKm * 100000;     // convert km to meters
        this.myStationUi = t.stop.StopDescr;
        this.myStationDistanceInMeters = distanceMeters;
      }),
      switchMap(s => {
        return forkJoin({
          coords: of(s.coords),
          stop: of(s.stop),
          buses: this._oasaApi.webRoutesForStop(s.stop.StopCode),
        });
      }),
      catchError((e: any) => {
        console.error(e);
        return EMPTY;
      }),
      tap(t => {
        console.log(t.buses);

        this.buseRoutes = t.buses;
      }),
    ).subscribe()
  }

  protected onBusSelected(busRoute: Route) {

  }


}

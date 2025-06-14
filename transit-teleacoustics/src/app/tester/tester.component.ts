import { Component } from '@angular/core';
import { OasaApiService, Stop } from '../services/oasa-api.service';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { Coordinates, LocationService } from '../services/location.service';

@Component({
  selector: 'app-tester',
  imports: [CommonModule],
  templateUrl: './tester.component.html',
  styleUrl: './tester.component.css'
})
export class TesterComponent {
  protected locUi: string | undefined;
  protected stopsUi: string | undefined;
  protected busesUi: string | undefined;
  protected busLocationUi: string | undefined;

  constructor(
    private _oasaApi: OasaApiService,
    private _locationApi: LocationService
  ) {
    _locationApi.getCurrentLocation().pipe(
      catchError((e: any) => {
        this.locUi = JSON.stringify(e, null, 2);
        return EMPTY;
      }),
      tap(t => {
        this.locUi = `accuracy: ${t.accuracy}, latitude: ${t.latitude}, longitude: ${t.longitude}`
      }),
      switchMap((s: Coordinates) => {
        return forkJoin({
          coords: of(s),
          stop: _oasaApi.getNearestStop(s.latitude, s.longitude),
        })
      }),
      catchError((e: any) => {
        this.stopsUi = JSON.stringify(e, null, 2);
        return EMPTY;
      }),
      tap(t => {
        const distanceKm = parseFloat(t.stop.distance);   // parse string to number (km)
        const distanceMeters = (distanceKm * 100000).toFixed(0);     // convert km to meters
        this.stopsUi = `Code: ${t.stop.StopCode}, Descr: ${t.stop.StopDescr}, Distance: ${distanceMeters} <br/>`;
      }),
      switchMap(s => {
        return forkJoin({
          coords: of(s.coords),
          stop: of(s.stop),
          buses: this._oasaApi.webRoutesForStop(s.stop.StopCode),
        });
      }),
      catchError((e: any) => {
        this.busesUi = JSON.stringify(e, null, 2);
        return EMPTY;
      }),
      tap(t => {
        this.busesUi = t.buses.map(m => {
          return `LineID: ${m.LineID}, LineDescr: ${m.LineDescr} <br/>`
        }).join('');
      }),
      switchMap(s => {
        return forkJoin({
          coords: of(s.coords),
          stop: of(s.stop),
          buses: of(s.buses),
          busLocation: this._oasaApi.getBusLocation(s.buses.at(0)?.RouteCode ?? '')
        });
      }),
      catchError((e: any) => {
        this.busLocationUi = JSON.stringify(e, null, 2);
        return EMPTY;
      }),
      tap(t => {
        this.busLocationUi = JSON.stringify(t.busLocation, null, 2);
      }),
    ).subscribe();
  }
}

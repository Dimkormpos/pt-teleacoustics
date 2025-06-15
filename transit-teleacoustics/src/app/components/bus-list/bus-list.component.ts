import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OasaApiService, Route, Stop } from '../../services/oasa-api.service';
import { catchError, EMPTY, forkJoin, of, switchMap, tap } from 'rxjs';
import { Coordinates, LocationService } from '../../services/location.service';
import { Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-bus-list',
  imports: [CommonModule],
  templateUrl: './bus-list.component.html',
  styleUrl: './bus-list.component.css'
})
export class BusListComponent {
  protected busRoutes: Route[] | undefined;
  protected myStationUi: string | undefined;
  protected myStationDistanceInMeters: number | undefined;

  constructor(
    private _oasaApi: OasaApiService,
    private _locationApi: LocationService,
    private _router: Router,
    private _dataTransfer: DataTransferService
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
        this._dataTransfer.setCurrentStop(t.stop);
        const distanceKm = parseFloat(t.stop.distance);   // parse string to number (km)
        const distanceMeters = distanceKm * 100000;     // convert km to meters
        this.myStationUi = t.stop.StopDescr;
        this.myStationDistanceInMeters = distanceMeters;
      }),
      switchMap(s => {
        return forkJoin({
          coords: of(s.coords),
          stop: of(s.stop),
          routedBuses: this._oasaApi.webRoutesForStop(s.stop.StopCode),
          arrivalBuses: this._oasaApi.getStopArrivals(s.stop.StopCode),
        });
      }),
      catchError((e: any) => {
        console.error(e);
        return EMPTY;
      }),
      tap(t => {
        this.busRoutes = t.routedBuses.filter(f => t.arrivalBuses.some(s => s.routeCode == f.RouteCode));

        // Add a fake bus (demo only)
        this.busRoutes.unshift({
          RouteCode: 'FAKE01',
          LineCode: 'DEMO123',
          RouteDescr: 'Demo Bus',
          RouteDescrEng: 'Demo Bus',
          RouteType: 'Urban',
          RouteDistance: '5000', // meters
          LineID: '999',
          LineDescr: 'ΠΕΙΡΑΙΑΣ - ΝΕΑΠΟΛΗ (DEMO LINE)',
          LineDescrEng: 'Demo Line',
          MasterLineCode: 'DEMOMASTER'
        });        
      }),
    ).subscribe();
  }

  protected onBusSelected(busRoute: Route) {
    this._dataTransfer.setSelectedBusRoute(busRoute);
    this._router.navigate(['/bus-waiting']);
  }


}

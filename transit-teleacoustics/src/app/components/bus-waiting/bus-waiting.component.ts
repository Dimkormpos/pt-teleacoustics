import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BusLocation, OasaApiService, Route, Stop, StopArrival } from '../../services/oasa-api.service';
import { catchError, EMPTY, forkJoin, interval, map, of, startWith, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { Coordinates, LocationService } from '../../services/location.service';

@Component({
  selector: 'app-bus-waiting',
  imports: [CommonModule],
  templateUrl: './bus-waiting.component.html',
  styleUrl: './bus-waiting.component.css'
})
export class BusWaitingComponent {
  protected stop: Stop | undefined;
  protected stopArrival: StopArrival | undefined;
  protected busRoute: Route | undefined;
  protected busLocation: BusLocation | undefined;
  protected busDistanceInMeters: number | undefined;

  private refreshInterval: number = 10000;

  constructor(
    private _oasaApi: OasaApiService,
    private _dataTransfer: DataTransferService,
    private _router: Router,
  ) {
    this.busRoute = this._dataTransfer.getSelectedBusRoute();
    this.stop = this._dataTransfer.getCurrentStop();
    if (!this.busRoute || !this.busRoute.RouteCode || !this.stop || !this.stop) {
      console.error('Route or stop not found. Going back.')
      this._router.navigate(['/home']);
      return;
    }

    interval(this.refreshInterval).pipe( // emits every 10 seconds
      startWith(0), // immediately run on subscription
      switchMap(() =>
        forkJoin({
          busLocations: this._oasaApi.getBusLocations(this.busRoute!.RouteCode),
          stopArrivals: this._oasaApi.getStopArrivals(this.stop!.StopCode)
        }).pipe(
      catchError((e: any) => {
        console.error(e);
        return EMPTY;
      })
        )
      ),
      tap(({ busLocations, stopArrivals }) => {
        this.stopArrival = stopArrivals.find(f => f.routeCode == this.busRoute!.RouteCode);
        this.busLocation = busLocations.find(f =>
          f.VEH_NO == this.stopArrival?.vehicleCode &&
          f.ROUTE_CODE == this.stopArrival.routeCode
        );

        this.busDistanceInMeters = this.haversineDistance(
          this.stop?.StopLat,
          this.stop?.StopLng,
          this.busLocation?.CS_LAT,
          this.busLocation?.CS_LNG
        );
      })
    ).subscribe();

  }

  private haversineDistance(
    inputLat1: string | undefined,
    inputLon1: string | undefined,
    inputLat2: string | undefined,
    inputLon2: string | undefined
  ): number | undefined {
    if (!inputLat1 || !inputLon1 || !inputLat2 || !inputLon2) {
      return undefined;
    }
    const lat1: number = parseFloat(inputLat1);
    const lon1: number = parseFloat(inputLon1);
    const lat2: number = parseFloat(inputLat2);
    const lon2: number = parseFloat(inputLon2);
    const toRadians = (degrees: number) => degrees * Math.PI / 180;

    const R = 6371000; // Earth's radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  }

}

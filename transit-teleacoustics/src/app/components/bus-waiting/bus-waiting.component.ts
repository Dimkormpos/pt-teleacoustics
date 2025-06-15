import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BusLocation, OasaApiService, Route, Stop, StopArrival } from '../../services/oasa-api.service';
import { BehaviorSubject, catchError, EMPTY, forkJoin, interval, map, of, startWith, Subject, Subscription, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { Coordinates, LocationService } from '../../services/location.service';

@Component({
  selector: 'app-bus-waiting',
  imports: [CommonModule],
  templateUrl: './bus-waiting.component.html',
  styleUrl: './bus-waiting.component.css'
})
export class BusWaitingComponent implements OnDestroy {
  protected stop: Stop | undefined;
  protected stopArrival: StopArrival | undefined;
  protected busRoute: Route | undefined;
  protected busLocation: BusLocation | undefined;
  protected busDistanceInMeters: number | undefined;
  protected evacuation$: Subject<void> = new Subject();

  private observingVehicleCode: string | undefined;
  private refreshSub: Subscription | undefined;
  private refreshTrigger$: Subject<number> = new Subject<number>();
  private currentRefreshInterval = 6000;

  private demoIteration: number = 0;
  private demoBusDistance: number[] = [
    575,
    120,
    20,
    5
  ];

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

    this.evacuation$.asObservable().pipe(
      tap(_ => {
        this._router.navigate(['/next-stop']);
      })
    ).subscribe();

    this.refreshSub = this.refreshTrigger$
      .pipe(
        switchMap((intervalMs) =>
          interval(intervalMs).pipe(
            startWith(0), // emit immediately
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
              if (this.busRoute!.RouteCode == 'FAKE01') {
                this.playDemo();
              } else {

                this.stopArrival = stopArrivals.find(f => f.routeCode == this.busRoute!.RouteCode);

                if (this.observingVehicleCode === undefined) {
                  this.observingVehicleCode = this.stopArrival?.vehicleCode;
                }

                if (this.observingVehicleCode !== this.stopArrival?.vehicleCode) {
                  this.evacuation$.next();
                }

                this.busLocation = busLocations.find(f =>
                  f.VEH_NO === this.stopArrival?.vehicleCode &&
                  f.ROUTE_CODE === this.stopArrival.routeCode
                );

                this.busDistanceInMeters = this.haversineDistance(
                  this.stop?.StopLat,
                  this.stop?.StopLng,
                  this.busLocation?.CS_LAT,
                  this.busLocation?.CS_LNG
                );

                const minutes = this.stopArrival?.minutesUntilArrival ?? 99;
                const desiredInterval = minutes <= 2 ? 3000 : 10000;

                if (desiredInterval !== this.currentRefreshInterval) {
                  this.currentRefreshInterval = desiredInterval;
                  this.refreshTrigger$.next(desiredInterval);
                }
              }
            })
          )
        )
    ).subscribe();

    // 🚀 Initial kick-off
    this.refreshTrigger$.next(this.currentRefreshInterval);

  }
  private playDemo() {
    this.stopArrival = {
      vehicleCode: 'FAKE01',
      routeCode: this.busRoute!.RouteCode,
      minutesUntilArrival: 3 - this.demoIteration
    };

    if (this.observingVehicleCode === undefined) {
      this.observingVehicleCode = this.stopArrival?.vehicleCode;
    }

    const demoCoords = this.demoBusDistance.at(Math.floor(Math.random() * this.demoBusDistance.length))

    this.busLocation = {
      btime2: '9',
      CS_LAT: '',
      CS_LNG: '',
      CS_DATE: '',
      route_code: '',
      ROUTE_CODE: '',
      veh_code: '',
      VEH_NO: '',
    }

    const minutes = this.stopArrival?.minutesUntilArrival ?? 99;
    this.busDistanceInMeters = this.demoBusDistance[this.demoIteration]
    const desiredInterval = minutes <= 2 ? 6000 : 6000;

    if (minutes == -1) {
      this.evacuation$.next();
    }

    if (desiredInterval !== this.currentRefreshInterval) {
      this.currentRefreshInterval = desiredInterval;
      this.refreshTrigger$.next(desiredInterval);
    }

    this.demoIteration++;
  }

  public ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
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

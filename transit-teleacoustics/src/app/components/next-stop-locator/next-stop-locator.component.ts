import { Component, OnInit } from '@angular/core';
import { OasaApiService, StopInfo } from '../../services/oasa-api.service';
import { combineLatest, interval, map, startWith, switchMap, tap } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-next-stop-locator',
  imports: [CommonModule],
  templateUrl: './next-stop-locator.component.html',
  styleUrl: './next-stop-locator.component.css'
})
export class NextStopLocatorComponent implements OnInit {
  public routeCode: string = "3347"
  public currentStopCode: string = "400140"
  public routeStops: StopInfo[] = [];
  public currentStop: StopInfo | undefined = undefined;
  public nextStop: StopInfo | undefined = undefined;
  public hasInitialized = false;
  public lastNotifiedStopCode: string | null = null;
  public approachingStopMessage: string | null = null;
  public nextStopMessage: string | null = null;  

  constructor(
    private oasaApiService: OasaApiService, 
    private locationService: LocationService, 
    private dataTransferService: DataTransferService) { }

  ngOnInit(): void {
    // this.routeCode = this.dataTransferService.getSelectedBusRoute()?.RouteCode ?? "3347";
    // this.currentStopCode = this.dataTransferService.getCurrentStop()?.StopCode ?? "400141";

    // demo stops array
    const demoStops = [
      { lat: 37.9496069, lng: 23.6410547, name: 'ΠΑΡΑΛΙΑ' },
      { lat: 37.9482284, lng: 23.6420818, name: 'ΣΤ.ΜΕΤΡΟ ΠΕΙΡΑΙΑΣ' },
      { lat: 37.9460535, lng: 23.6410725, name: 'ΠΕΙΡΑΙΑΣ ΠΛ. ΚΑΡΑΪΣΚΑΚΗ' }
    ];
    
    const fakeLocation$ = interval(12000).pipe(
      map(i => {
        const stop = demoStops[i % demoStops.length];
        // Simulate 'near' the stop, not exact coords
        const offset = 0.0001; 
        return {
          latitude: stop.lat + (Math.random() - 0.5) * offset,
          longitude: stop.lng + (Math.random() - 0.5) * offset,
          accuracy: 10 // fake accuracy value
        };
      }),
      startWith({
        latitude: demoStops[0].lat,
        longitude: demoStops[0].lng,
        accuracy: 10
      })
    );
    
    // combineLatest([this.oasaApiService.webGetStops(this.routeCode), this.locationService.watchPosition()])
    combineLatest([this.oasaApiService.webGetStops(this.routeCode), fakeLocation$])
    .pipe(
      tap(([stops, coordinates]) => {
        this.routeStops = stops;
        console.log(coordinates);
        console.log(stops);

        if (!this.hasInitialized) {
          // First time: set current and next stop
          this.currentStop = this.routeStops.find(x => x.StopCode === this.currentStopCode);

          if (this.currentStop) {
            const nextOrder = (parseInt(this.currentStop.RouteStopOrder, 10) + 1).toString();
            this.nextStop = this.routeStops.find(x => x.RouteStopOrder === nextOrder);
            console.log('First next stop:', this.nextStop?.StopDescr);
            this.nextStopMessage = `Επόμενη στάση: ${this.nextStop?.StopDescr}`;
          }

          this.hasInitialized = true;
          return;
        }

        if (this.nextStop) {
          const distance = this.calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            parseFloat(this.nextStop.StopLat),
            parseFloat(this.nextStop.StopLng)
          );

          if (distance < 50 && this.nextStop.StopCode !== this.lastNotifiedStopCode) {
            console.log(`You're about to reach stop: ${this.nextStop.StopDescr}`);
            this.approachingStopMessage = `Πλησιάζετε στη στάση: ${this.nextStop.StopDescr}`;

            // Prevent duplicate notifications
            this.lastNotifiedStopCode = this.nextStop.StopCode;         
            // Move to next stop
            this.currentStop = this.nextStop;
            const nextOrder = (parseInt(this.currentStop.RouteStopOrder, 10) + 1).toString();
            this.nextStop = this.routeStops.find(x => x.RouteStopOrder === nextOrder);

            if (this.nextStop) {
              console.log('Upcoming next stop:', this.nextStop.StopDescr);
              this.nextStopMessage = `Επόμενη στάση: ${this.nextStop.StopDescr}`;
            } else {
              console.log('End of route reached');
              this.nextStopMessage = `Τέλος διαδρομής`;
            }
          }
        }        
      }),
    ).subscribe();
  }


  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadius = 6371e3; // Earth radius in meters
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const deltaLat = (lat2 - lat1) * Math.PI / 180;
    const deltaLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c; // in meters
  }
  
}

import { Component, OnInit } from '@angular/core';
import { OasaApiService, StopInfo } from '../../services/oasa-api.service';
import { combineLatest, interval, map, startWith, switchMap, tap } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-next-stop-locator',
  imports: [CommonModule],
  templateUrl: './next-stop-locator.component.html',
  styleUrl: './next-stop-locator.component.css'
})
export class NextStopLocatorComponent implements OnInit {
  public routeCode: string = "5412"
  public currentStopCode: string = "190013"
  public routeStops: StopInfo[] = [];
  public currentStop: StopInfo | undefined = undefined;
  public nextStop: StopInfo | undefined = undefined;
  public hasInitialized = false;
  public lastNotifiedStopCode: string | null = null;
  public stopMessage: string | null = null;

  constructor(private oasaApiService: OasaApiService, private locationService: LocationService) { }

  ngOnInit(): void {
    // Your demo stops array (use your real stops from API or static)
    const demoStops = [
      { lat: 38.0440729, lng: 23.5440421, name: 'ΡΕΞ' },
      { lat: 38.0459804, lng: 23.5489722, name: 'ΑΕΡΟΔΡΟΜΙΟΥ' },
      { lat: 38.0475381, lng: 23.5536791, name: 'ΛΕΥΚΕΣ' }
    ];    
    
    const fakeLocation$ = interval(12000).pipe(
      map(i => {
        const stop = demoStops[i % demoStops.length];
        // You can add a tiny random offset if you want to simulate 'near' the stop, not exact coords
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
            this.stopMessage = `Επόμενη στάση: ${this.nextStop?.StopDescr}`;
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
          this.stopMessage = `Πλησιάζετε στη στάση: ${this.nextStop.StopDescr}`;

          // Prevent duplicate notifications
          this.lastNotifiedStopCode = this.nextStop.StopCode;         
          // Move to next stop
          this.currentStop = this.nextStop;
          const nextOrder = (parseInt(this.currentStop.RouteStopOrder, 10) + 1).toString();
          this.nextStop = this.routeStops.find(x => x.RouteStopOrder === nextOrder);

          if (this.nextStop) {
            console.log('Upcoming next stop:', this.nextStop.StopDescr);
            this.stopMessage += ` | Επόμενη στάση: ${this.nextStop.StopDescr}`;
          } else {
            console.log('End of route reached');
            this.stopMessage += ` | Τέλος διαδρομής`;
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

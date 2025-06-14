import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private ngZone: NgZone) { }

  /**
   * Gets the current location once.
   */
  getCurrentLocation(): Observable<Coordinates> {
    return new Observable<Coordinates>((observer) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by your browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            latitude: 37.948781, //position.coords.latitude,
            longitude: 23.642337, //position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          observer.complete();
        },
        (error) => {
          observer.error('Unable to retrieve location: ' + error.message);
        },
        {
          enableHighAccuracy: true, // Request GPS-level accuracy
          timeout: 10000,           // Wait up to 10 seconds for a result
          maximumAge: 0             // Always get a fresh position
        }
      );
    });
  }
  /**
   * Watches the position continuously.
   */
  watchPosition(): Observable<Coordinates> {
    return new Observable<Coordinates>((observer) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by your browser.');
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.ngZone.run(() => {
            observer.next({
              latitude: 37.948781, //position.coords.latitude,
              longitude: 23.642337, //position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          });
        },
        (error) => {
          this.ngZone.run(() => {
            observer.error('Unable to track location: ' + error.message);
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      // Unsubscribe logic: stop watching when no longer needed
      return () => navigator.geolocation.clearWatch(watchId);
    });
  }
}

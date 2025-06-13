import { Injectable } from '@angular/core';
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
  constructor() { }

  getCurrentLocation(): Observable<Coordinates> {
    return new Observable<Coordinates>((observer) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by your browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            latitude: 37.9770908,//position.coords.latitude,
            longitude: 23.7130034,//position.coords.longitude,
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
}

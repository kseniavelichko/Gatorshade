import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  API = "305b8d0b9ea7ea79d9ca3cd998b0a95f";
  URL = "https://api.openweathermap.org/data/2.5/weather?lat=29.6520&lon=-82.3250&appid=305b8d0b9ea7ea79d9ca3cd998b0a95f&units=imperial";
  constructor(private http: HttpClient) { }

  getCurrentWeather(): Observable<any> {
    return this.http.get<any>(this.URL);
  }
}

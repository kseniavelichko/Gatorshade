import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  API: string = environment.weatherKey;
  URL = 'https://api.openweathermap.org/data/2.5/weather?lat=29.6520&lon=-82.3250&appid='+this.API+'&units=imperial';
  constructor(private http: HttpClient) { }

  getCurrentWeather(): Observable<any> {
    return this.http.get<any>(this.URL);
  }
  getTempLayer(): Observable<any> {
    return this.http.get<any>('https://tile.openweathermap.org/map/temp_new/9/190/200.png?appid=' + this.API);
  }
}

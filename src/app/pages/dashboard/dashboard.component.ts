import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { MapComponent } from '../../components/map/map.component';
import { WeatherComponent } from '../../components/weather/weather.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MapComponent, WeatherComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit  {
  currentTime: Date | any;

  constructor() { }

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime(): void {
    this.currentTime = new Date();
  }
}

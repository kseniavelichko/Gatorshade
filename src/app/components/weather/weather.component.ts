import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { HeatIndexService } from '../../services/heatindex.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {
  currentWeather: any;
  seeDef = false;
  viewResources = false;
  warning: any;
  warningMessage: any;
  constructor(private weatherService: WeatherService, private heatService: HeatIndexService) { }
  temp = 0;
  humidity = 0;

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather(): void {
    this.weatherService.getCurrentWeather().subscribe(data => {
      this.currentWeather = data;
      console.log(data);
    });

  }
  getWarning(): string {
    if (this.warning == "Extreme Danger") {
      this.warningMessage = "Heat stroke or sunstroke is likely.";
      return 'warningRed'
    }
    if (this.warning == "Danger") {
      this.warningMessage = "Sunstroke, muscle cramps, and/or heat exhaustion likely. Heatstroke possible with prolonged exposure and/or physical activity.";
      return 'warningOrange'
    }
    if (this.warning == "Extreme Caution") {
      this.warningMessage = "Sunstroke, muscle cramps, and/or heat exhaustion possible with prolonged exposure and/or physical activity.";
      return 'warningOrangeLight'
    }
    if (this.warning == "Caution") {
      this.warningMessage = "Fatigue possible with prolonged exposure and/or physical activity.";
      return 'warningYellow'
    }
    return ''
  }
  getColor(heatIndex: number): string {
    if (heatIndex > 130) {
      this.warning = "Extreme Danger";
      return 'bg-red-500/50'
    }
    if (heatIndex > 105) {
      this.warning = "Danger";
      return 'bg-orange-600/40'
    }
    if (heatIndex > 90) {
      this.warning = "Extreme Caution";
      return 'bg-orange-300/60'
    }
    if (heatIndex > 80) {
      this.warning = "Caution";
      return 'bg-yellow-200/60'
    }
    return 'bg-green-200/80'
  } 
}

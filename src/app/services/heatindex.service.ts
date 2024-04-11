// heat-index.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeatIndexService {

  constructor() { }

  calculateHeatIndex(tempInF: number, hum: number): number {
    let c1 = -42.379;
    let c2 = 2.04901523;
    let c3 = 10.14333127;
    let c4 = -0.22475541;
    let c5 = -6.83783e-3;
    let c6 = -5.481717e-2;
    let c7 = 1.22874e-3;
    let c8 = 8.5282e-4;
    let c9 = -1.99e-6;

    if (tempInF < 80) {
      c1 = 16.923;
      c2 = 0.185212;
      c3 = 5.37941;
      c4 = -0.100254;
      c5 = 9.41695e-3;
      c6 = 7.28898e-3;
      c7 = 3.45372e-4;
      c8 = -8.14971e-4;
      c9 = 1.02102e-5;
    }
    let heatIndex = (c1 + (c2 * tempInF) + (c3 * hum) + (c4 * tempInF * hum) + (c5 * tempInF ** 2) + (c6 * hum ** 2) + (c7 * tempInF ** 2 * hum) + (c8 * tempInF * hum ** 2) + (c9 * tempInF ** 2 * hum ** 2));

    return heatIndex;
  }
}

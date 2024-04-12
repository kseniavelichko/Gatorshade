import { Component , AfterViewInit, ViewChild} from '@angular/core';
import { MapInfoWindow, GoogleMapsModule, GoogleMap, MapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { HttpClient } from '@angular/common/http';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, FormsModule, ToggleButtonModule, MapMarker, CommonModule, MapInfoWindow],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit{
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow | any;
  @ViewChild(MapInfoWindow, { static: false }) routeInfo: MapInfoWindow | any;
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap | any;
  routeLayer: any;
  blueIcon: google.maps.Icon = {
    url: '../../assets/blue.png',
    scaledSize: new google.maps.Size(30, 30)
  }
  blueYellowIcon: google.maps.Icon = {
    url: '../../assets/blue-yellow.png',
    scaledSize: new google.maps.Size(30, 30)
  }
  redIcon: google.maps.Icon = {
    url: '../../assets/red.png',
    scaledSize: new google.maps.Size(30, 30)
  }
  yellowIcon: google.maps.Icon = {
    url: '../../assets/yellow.png',
    scaledSize: new google.maps.Size(30, 30)
  }
  parkMarker: google.maps.MarkerOptions = {
    draggable: false,
    icon: this.blueYellowIcon
  };
  coolingMarker: google.maps.MarkerOptions = {
    draggable: false,
    icon: this.blueIcon
  };
  incompleteMarker: google.maps.MarkerOptions = {
    draggable: false,
    icon: this.redIcon
  };
  completeMarker: google.maps.MarkerOptions = {
    draggable: false,
    icon: this.yellowIcon
  };
  zoom = 12;
  constructor(private httpClient: HttpClient, private weatherService: WeatherService) {
  }
  heatMap: boolean = true;
  centerView: boolean = true;
  patterns: any[] = [];
  coolingCenter: google.maps.LatLng | any;
  closestBuses: Set<any> = new Set();
  icons: Record<string, any> = {
    blueStop: {
      name: "Cooling Center",
      icon: "../../assets/blue.png",
    }
  };
  displayTemp() {
    if (this.heatMap) {
      this.getWeather();
    }
    else {
      this.map.overlayMapTypes.clear();
    }
  }
  displayStops() {
    if (!this.centerView) {
      this.loadClosest();
    }
  }
  loadGeoJSON(): void {
    this.httpClient.get('assets/route.geojson').subscribe((data: any) => {
      const features = data.features;
      this.map.data.addGeoJson(data);
      this.map.data.setStyle((feature: any) => ({
        fillColor: '#' + feature.getProperty('color'),
        strokeWeight: 3,
        strokeColor: '#' + feature.getProperty('color'),
        fillOpacity: 0.7,
        visible: false
      }));
    });
  }
  loadClosest() {
    this.closestBuses.clear();
    if (!this.map || !this.map.data) {
      console.error('Map or data layer is not initialized.');
      return;
    }
    this.map.data.forEach((feature: any) => {
      
        const routeId = feature.getProperty('route_id');
        const isVisible = this.closestRoute(this.coolingCenter, routeId);
        this.map.data.overrideStyle(feature, { visible: isVisible });
        if (!this.centerView) {
          this.map.data.overrideStyle(feature, { visible: false });
        }
      
    });
  }
  ngAfterViewInit(): void {
    const legend = document.getElementById("legend") as HTMLElement;
    for (const key in this.icons) {
      const type = this.icons[key];
      const name = type.name;
      const icon = type.icon;
      const div = document.createElement("div");

      div.innerHTML =  name + ': <img class="h-10 w-10" src="' + icon + '"> ';
      legend.appendChild(div);
    }
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(legend);
    this.getWeather();
    this.loadGeoJSON();
    this.loadClosest();
  }
  closestRoute(point: google.maps.LatLng, featureId: number): boolean {
    var areTheyClose = false;
    this.map.data.forEach((feature: any) => {
      const properties = feature.getProperty('route_id');
      if (properties === featureId) {
        const geometry = feature.getGeometry();
          for (let i = 0; i < geometry.getArray().length; i++) {
            const vertex = geometry.getArray()[i];
            const distance = google.maps.geometry.spherical.computeDistanceBetween(point, vertex);
            if (distance <= 350) {
              areTheyClose = true; 
              this.closestBuses.add(properties + ": " + feature.getProperty('long_name'));
            }
        }
      }
    });
    return areTheyClose;
  }
  display: any;
  content: any;
  locationTitle: any;
  routeContent: any;
  routeTitle: any;
  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()))
  }
  markers: any[] = [
    { option: this.coolingMarker, title: 'Alachua Branch Library', position: { lat: 29.796937, lng: -82.487590 }, address: '14913 N.W. 140 Street, Alachua' },
    { option: this.coolingMarker, title: 'Archer Branch Library', position: { lat: 29.529294, lng: -82.520197 }, address: '13266 S.W. State Road 45, Archer' },
    { option: this.coolingMarker, title: 'Clarence R Kelly Center', position: { lat: 29.668782, lng: -82.309217 }, address: '1701 N.E. 8th Avenue, Gainesville' },
    { option: this.coolingMarker, title: 'Cone Park Branch Library', position: { lat: 29.648935, lng: -82.305632 }, address: '2801 E. University Ave., Gainesville' },
    { option: this.coolingMarker, title: 'Eastside Community Center at Cone Park', position: { lat: 29.649674, lng: -82.304237 }, address: '2841 E.University Avenue, Gainesville' },
    { option: this.coolingMarker, title: 'Hawthorne Branch Library', position: { lat: 29.587381, lng: -82.113358 }, address: '6640 S.E. 221 Street, Hawthorne' },
    { option: this.coolingMarker, title: 'Headquarters Library', position: { lat: 29.651997, lng: -82.325440 }, address: '401 E. University Avenue, Gainesville' },
    { option: this.coolingMarker, title: 'High Springs Branch Library', position: { lat: 29.823832, lng: -82.589744 }, address: '23779 W. U.S. Hwy 27, High Springs' },
    { option: this.coolingMarker, title: 'Library Partnership Branch', position: { lat: 29.667960, lng: -82.307258 }, address: '912 N.E. 16 Avenue, Gainesville' },
    { option: this.coolingMarker, title: 'Micanopy Branch Library', position: { lat: 29.507782, lng: -82.281984 }, address: '706 N.E. Cholokka Boulevard, Micanopy' },
    { option: this.coolingMarker, title: 'Millhopper Branch Library', position: { lat: 29.688163, lng: -82.367582 }, address: '3145 N.W. 43rd Street, Gainesville' },
    { option: this.coolingMarker, title: 'MLK Center', position: { lat: 29.664935, lng: -82.306711 }, address: '1028 N.E. 14th Street, Gainesville' },
    { option: this.coolingMarker, title: 'Newberry Branch Library', position: { lat: 29.634003, lng: -82.606481 }, address: '110 S. Seaboard Drive, Newberry' },
    { option: this.coolingMarker, title: 'Tower Road Branch Library', position: { lat: 29.634073, lng: -82.389595 }, address: '3020 S.W. 75th Street, Gainesville' },
    { option: this.coolingMarker, title: 'Waldo Branch Library', position: { lat: 29.787931, lng: -82.160516 }, address: '15150 N.E. U.S. Hwy 301, Waldo' },
  ];
  parks: any[] = [
    {
      title: "Roper Park",
      position: { lat: 29.6495, lng: -82.3216 },
      address: "401 NE 2nd St, Gainesville, FL 32601"
    },
    {
      title: "Haisley Lynch Park",
      position: { lat: 29.651, lng: -82.3247 },
      address: "424 S Main St STE 414, Gainesville, FL 32601"
    },
    {
      title: "Cora P. Roberson Park",
      position: { lat: 29.6421, lng: -82.3312 },
      address: "600 SW 6th St, Gainesville, FL 32601"
    },
    {
      title: "Depot Park",
      position: { lat: 29.6476, lng: -82.3207 },
      address: "874 SE 4th St, Gainesville, FL 32601"
    },
    {
      title: "Reserve Park",
      position: { lat: 29.6593, lng: -82.3049 },
      address: "1125 NE 8th Ave, Gainesville, FL 32601"
    },
    {
      title: "Barbara Higgins Park",
      position: { lat: 29.6427, lng: -82.3134 },
      address: "1352 SE 2nd St, Gainesville, FL 32601"
    },
    {
      title: "C.F. Franklin Memorial Park",
      position: { lat: 29.6574, lng: -82.3067 },
      address: "1504 NE 4th Ave, Gainesville, FL 32641"
    },
    {
      title: "Dwight H. Hunter Pool",
      position: { lat: 29.6546, lng: -82.3126 },
      address: "1100 Northeast 14th Street, Gainesville, FL 32601"
    },
    {
      title: "Lincoln Park",
      position: { lat: 29.6451, lng: -82.3043 },
      address: "924 SE 15th St, Gainesville, FL 32641"
    },
    {
      title: "Citizens Field",
      position: { lat: 29.6614, lng: -82.3128 },
      address: "1400 NE 8th Ave, Gainesville, FL 32601"
    },
    {
      title: "Andrew R. Mickle, Sr. Pool",
      position: { lat: 29.6354, lng: -82.3061 },
      address: "1717 SE 15th St, Gainesville, FL 32641"
    },
    {
      title: "TB McPherson Park",
      position: { lat: 29.636, lng: -82.3055 },
      address: "1717 SE 15th St, Gainesville, FL 32641"
    },
    {
      title: "Cedar Grove Park",
      position: { lat: 29.6697, lng: -82.3059 },
      address: "1201 NE 22nd St, Gainesville, FL 32601"
    },
    {
      title: "Smokey Bear Park",
      position: { lat: 29.679, lng: -82.3037 },
      address: "2300 NE 15th St, Gainesville, FL 32609"
    },
    {
      title: "Fred Cone Park",
      position: { lat: 29.6523, lng: -82.2988 },
      address: "2801 E University Ave, Gainesville, FL 32641"
    },
    {
      title: "Unity Park",
      position: { lat: 29.6773, lng: -82.3104 },
      address: "1710 NE 31st Ave, Gainesville, FL 32609"
    },
    {
      title: "H. Spurgeon Cherry Pool",
      position: { lat: 29.6797, lng: -82.3553 },
      address: "1001 NW 31 Dr, Gainesville, FL 32605"
    },
    {
      title: "Kiwanis Challenge Park",
      position: { lat: 29.6931, lng: -82.3583 },
      address: "Greentree Park, 2002 NW 36th Ave, Gainesville, FL 32605"
    },
    {
      title: "Albert Albert \"Ray\" Massey Park (Westside Park)",
      position: { lat: 29.6645, lng: -82.3666 },
      address: "3100-3346 NW 8th Ave, Gainesville, FL 32605"
    },
    {
      title: "Greentree Park",
      position: { lat: 29.6817, lng: -82.3548 },
      address: "3600 NW 19th St, Gainesville, FL"
    },
    {
      title: "Forest Park",
      position: { lat: 29.6241, lng: -82.3841 },
      address: "4501 SW 20th Ave, Gainesville, FL 32607"
    },
    {
      title: "Northside Park",
      position: { lat: 29.6899, lng: -82.4248 },
      address: "5701 NW 34th Blvd, Gainesville, FL 32653"
    },
    {
      title: "A.N.N.E. Park",
      position: { lat: 29.6964, lng: -82.4047 },
      address: "6310 NW 28th Terrace, Gainesville, FL 32653"
    },
    {
      title: "Possum Creek Park",
      position: { lat: 29.7125, lng: -82.3937 },
      address: "4009 NW 53rd Ave, Gainesville, FL 32653"
    },
    {
      title: "Oakhill Park",
      position: { lat: 29.6867, lng: -82.3616 },
      address: "4141 NW 9th St, Gainesville, FL 32609"
    },
    {
      title: "Sharmie Ffar Park",
      position: { lat: 29.6545, lng: -82.339 },
      address: "925 NW 4th Pl, Gainesville, FL 32601"
    }
  ]
  openInfo(marker: MapMarker, markerObj: any) {
    this.markers.forEach(mark => {
        mark.option = this.coolingMarker;
    });
    this.coolingCenter = marker.getPosition();
    markerObj.option = this.completeMarker;
    this.loadClosest();
    this.locationTitle = markerObj.title;
    this.content = markerObj.address;
    if (this.infoWindow != undefined) this.infoWindow.open(marker);
  }
  center: google.maps.LatLngLiteral = {
      lat: 29.651,
      lng: -82.357
  };
  getWeather(): void {
    const temperatureLayer = new google.maps.ImageMapType({
      getTileUrl: function(coord, zoom): string {
          return 'https://tile.openweathermap.org/map/temp_new/' + zoom + '/' + coord.x + '/' + coord.y + '.png?appid=305b8d0b9ea7ea79d9ca3cd998b0a95f'
      },
      tileSize: new google.maps.Size(256, 256),
      opacity: 0.9,
      name: 'Temperature',
      maxZoom: 9
    });
    this.map.overlayMapTypes.push(temperatureLayer);
};

}

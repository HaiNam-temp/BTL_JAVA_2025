import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // Tọa độ của Trường Đại học Công nghiệp Hà Nội
    const hauiLatLng: L.LatLngTuple = [21.0549, 105.7802]; 
    const map = L.map('map').setView(hauiLatLng, 16); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker(hauiLatLng) // Sử dụng tọa độ của trường
      .addTo(map)
      .bindPopup('Trường Đại học Công nghiệp Hà Nội')
      .openPopup();
  }
}
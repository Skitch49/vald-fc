import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiValdService {
  constructor(private http: HttpClient) {}

  getClips() {
    return this.http.get('http://localhost:5000/clip');
  }

  getClipsByUrl(url: string): Observable<any> {
    return this.http.get(`http://localhost:5000/clip/${url}`);
  }

  getLastClip() {
    return this.http.get('http://localhost:5000/clip/last-clip');
  }

  getClipsByDateRange(startDate: string, endDate: string): Observable<any> {
    return this.http.get(
      `http://localhost:5000/clip/date-range/${startDate}/${endDate}`
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiValdService {
  private apiUrl = 'alexis.delaunay.angers.mds-project.fr:3000'; //Or http://localhost:3000 in localhost
  
  constructor(private http: HttpClient) {}

  getClips() {
    return this.http.get(`${this.apiUrl}/clip`);
  }

  getClipsByUrl(url: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clip/${url}`);
  }

  getLastClip() {
    return this.http.get(`${this.apiUrl}/clip/last-clip`);
  }

  getClipsArtistesFeaturing(query: string) {
    return this.http.get(`${this.apiUrl}/clip/search/${query}`);
  }

  getClipsByDateRange(startDate: string, endDate: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/clip/date-range/${startDate}/${endDate}`
    );
  }

  getClipsLiked(userId: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/clip/clip-liked/${userId}` )
  }

  likeClip(clipId: string, userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/clip/like-clip/${clipId}`, { userId });
  }

  dislikeClip(clipId: string, userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/clip/dislike-clip/${clipId}`, {userId});
  }
  
  toggleLike(clipId: string, userId: string, like: boolean): Observable<any> {
    const action = like ? 'like-clip' : 'dislike-clip';
    return this.http.patch(`${this.apiUrl}/clip/${action}/${clipId}`, { userId });
  }
}

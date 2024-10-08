import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiValdService {

  private apiUrl = environment.apiValdUrl;

  private safeUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  getSafeUrl(): Observable<string> {
    return this.safeUrlSubject.asObservable();
  }

  updateSafeUrl(url: string): void {
    this.safeUrlSubject.next(url);
  }

  constructor(private http: HttpClient) {}

  // Clip

  getClips(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clip`);
  }

  getClipsByUrl(url: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clip/${url}`);
  }

  getLastClip() {
    return this.http.get(`${this.apiUrl}/clip/last-clip`);
  }

  getClipsLiked(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clip/clip-liked/${userId}`);
  }

  likeClip(clipId: string, userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/clip/like-clip/${clipId}`, {
      userId,
    });
  }

  dislikeClip(clipId: string, userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/clip/dislike-clip/${clipId}`, {
      userId,
    });
  }

  toggleLike(clipId: string, userId: string, like: boolean): Observable<any> {
    const action = like ? 'like-clip' : 'dislike-clip';
    return this.http.patch(`${this.apiUrl}/clip/${action}/${clipId}`, {
      userId,
    });
  }

  postClip(clip: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clip`, clip);
  }

  editClip(clip: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clip/${clip._id}`, clip);
  }

  deleteClip(clip: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clip/${clip._id}`,clip)
  }
  // Video

  getVideos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/video`);
  }

  getVideoByUrl(url: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/video/${url}`);
  }

  getLastVideo() {
    return this.http.get(`${this.apiUrl}/video/last-video`);
  }

  getVideosByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/video/categories/${category}`);
  }

  toggleLikeVideo(
    clipId: string,
    userId: string,
    like: boolean
  ): Observable<any> {
    const action = like ? 'like-video' : 'dislike-video';
    return this.http.patch(`${this.apiUrl}/video/${action}/${clipId}`, {
      userId,
    });
  }

  postVideo(video: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/video`, video);
  }

  editVideo(video: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/video/${video._id}`, video);
  }

  deleteVideo(video: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/video/${video._id}`,video)
  }

  // Video and Clips
  getClipsArtistesFeaturing(query: string) {
    return this.http.get(`${this.apiUrl}/clip/search/${query}`);
  }

  getAllVideoLiked(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clip/all-video-liked/${userId}`);
  }

  getAllVideoByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clip/categories/${category}`);
  }

  // Artistes
  getArtistes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/artiste`);
  }

  postArtiste(artiste: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/artiste`, artiste);
  }

  // Mail
  postMail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mail`, data);
  }
}

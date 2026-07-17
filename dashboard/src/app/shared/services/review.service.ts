import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private http: HttpClient) { }
  getReviews(pageIndex: number, pageSize: number): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('limit', pageSize.toString());
  
    return this.http.get(`${environment.baseUrl}/reviews/adminAll`, {params,headers});
  }

 getActiveReview(type:string = 'kid'): Observable<any> {
    let params = new HttpParams()
      .set('type', type)
      .set('isActive', true);
   
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });    
    return this.http.get(`${environment.baseUrl}/review/all`, { params, headers });
  } 
  
  createReview(formData: any): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });    
    return this.http.post(
      `${environment.baseUrl}/review`,
      formData,
      {
        headers,
        withCredentials: true, 
      }
    );
  }
}



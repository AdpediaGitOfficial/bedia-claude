import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUsers(filters: any, pageIndex: number, pageSize: number): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });
    let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('limit', pageSize.toString());
  
    if (filters.fullName) {
      params = params.set('fullName', filters.fullName);
    }
    if (filters.subscribed) {
      params = params.set('subscribed', filters.subscribed);
    }
    if (filters.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }
    if (filters.expiresIn7Days) {
      params = params.set('expiresIn7Days', 'true');
    }
    if (filters.isExpired) {
      params = params.set('isExpired', 'true');
    }
     if (filters.role) {
      params = params.set('role', filters.role);
    }
    return this.http.get(`${environment.baseUrl}/user/all`, { params, headers });
  }   
  
  unSubscribe(endpoint: string, id: string): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });    
    return this.http.get(`${environment.baseUrl}${endpoint}/${id}`, {headers});
  }
  }

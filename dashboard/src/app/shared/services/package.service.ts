import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  constructor(private http: HttpClient) { }
  
  getPackages(): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });    
    return this.http.get(`${environment.baseUrl}/api/package/allAdmin`,{headers});
  }

  createPackage(formData: any): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });    
    return this.http.post(
      `${environment.baseUrl}/api/package`,
      formData,
      {
        headers,
        withCredentials: true, 
      }
    );
  }

  getActivePackages(): Observable<any> {
    let params = new HttpParams()
      .set('isActive', true);   
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });    
    return this.http.get(`${environment.baseUrl}/api/package/allAdmin`, { params, headers });
  }  
 
}

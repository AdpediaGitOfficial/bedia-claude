import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }
  getCategories(pageIndex: number, pageSize: number): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('limit', pageSize.toString());
  
    return this.http.get(`${environment.baseUrl}/category/adminAll`, {params,headers});
  }

 getActiveCategories(): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });    
    return this.http.get(`${environment.baseUrl}/category/all`, {  headers });
  } 
  
  createCategory(formData: any): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });    
    return this.http.post(
      `${environment.baseUrl}/category`,
      formData,
      {
        headers,
        withCredentials: true, 
      }
    );
  }
}



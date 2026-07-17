import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursematerialService {
  constructor(private http: HttpClient) { }

  getCoursematerials(pageIndex: number, pageSize: number): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });    
    let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('limit', pageSize.toString());
    return this.http.get(`${environment.baseUrl}/api/coursematerial/all`, {headers, params});
  }


  createCourseMaterial(formData: any): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });    
    return this.http.post(
      `${environment.baseUrl}/api/coursematerial`,
      formData,
      {
        headers,
        withCredentials: true, 
      }
    );
  }
 
}
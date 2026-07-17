import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) {}

  deleteItem(endpoint: string, id: string): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });    
    return this.http.delete(`${environment.baseUrl}${endpoint}/${id}`, {headers});
  }
  
  getDataById(endpoint:string, id:string ): Observable<any> {    
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });    
    return this.http.get(`${environment.baseUrl}${endpoint}/${id}`, { headers });
  } 

  updateData(endpoint:string, id:string,formData: any): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });    
    return this.http.put(
      `${environment.baseUrl}${endpoint}/${id}`,
      formData,
      {
        headers,
        withCredentials: true, 
      }
    );
  }

  addData(endpoint:string, formData: any): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });    
    return this.http.post(
      `${environment.baseUrl}/${endpoint}`,
      formData,
      {
        headers,
        withCredentials: true, 
      }
    );
  }

  getData(pageIndex: number, pageSize: number, endpoint: string, paramsObj: any = {}): Observable<any> {
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });
  
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('limit', pageSize.toString());
  
    Object.keys(paramsObj).forEach((key) => {
      if (paramsObj[key] !== undefined && paramsObj[key] !== null) {
        params = params.set(key, paramsObj[key]);
      }
    });
  
    return this.http.get(`${environment.baseUrl}/${endpoint}`, { params, headers });
  }
  
  exportData(filters: any, endpoint: string): Observable<Blob> {    
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });
    let params = new HttpParams();
    
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
    return this.http.get(`${environment.baseUrl}/${endpoint}`, { params, headers, responseType: 'blob' });
  }

  getAllData(endpoint: string): Observable<any> {    
    const currentUser = localStorage.getItem('currentUser'); 
    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });    
    return this.http.get(`${environment.baseUrl}/${endpoint}`, { headers });
  } 
  
  postAction(endpoint: string, body: any = {}): Observable<any> {
    const currentUser = localStorage.getItem('currentUser');
    const token = currentUser ? JSON.parse(currentUser).token : null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(
      `${environment.baseUrl}/${endpoint}`,
      body,
      { headers }
    );
  }


}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const currentUser = localStorage.getItem('currentUser');
    const token = currentUser ? JSON.parse(currentUser).token : null;
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/dashboard/stats`, { headers: this.getHeaders() });
  }

  getDailyNewUsersChart(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/dashboard/chart/new-users`, { headers: this.getHeaders() });
  }
}

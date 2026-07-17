import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user.type';

const USER_AUTH_API_URL = '/api-url';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.baseUrl}/auth/login`, { email, password },        
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true, 
        })
        .pipe(
            map(response => {
                console.log("API Response:", response); 
                if (response.success && response.result) {
                    const user = response.result; 
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user); 
                }
                return response.result; 
            })
        );
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
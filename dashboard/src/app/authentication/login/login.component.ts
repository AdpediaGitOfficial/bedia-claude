import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup,  Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup;
    
    constructor(private fb: UntypedFormBuilder, 
        private authenticationService: AuthenticationService, 
        private router: Router, private notification: NzNotificationService ) {
    }

    submitForm(): void {
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[ i ].markAsDirty();
            this.loginForm.controls[ i ].updateValueAndValidity();
        }        

        const { userEmail, password } = this.loginForm.value;

        this.authenticationService.login(userEmail, password).subscribe(
            (response) => {
                console.log('Login successful', response);               
                this.router.navigate(['/dashboard/home']);
            },
            (error) => {
                this.notification.error('Error', 'Invalid Email/Password');                
            }
        );
        
    }


    ngOnInit(): void {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            this.router.navigate(['/dashboard/home']);
        }
        this.loginForm = this.fb.group({
            userEmail: [ null, [ Validators.required, Validators.email ] ],
            password: [ null, [ Validators.required ] ]
        });
    }
}

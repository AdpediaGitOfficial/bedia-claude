import { Component } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup,  Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './login-3.component.html'
})

export class Login3Component {
    loginForm: UntypedFormGroup;
    
    constructor(private fb: UntypedFormBuilder, 
        private authenticationService: AuthenticationService, private router: Router ) {
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
                // Redirect to dashboard or home page
                this.router.navigate(['/dashboard']);
            },
            (error) => {
                console.error('Login failed', error);
                // Handle error (e.g., show a notification or error message)
            }
        );
        
    }


    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userEmail: [ null, [ Validators.required, Validators.email ] ],
            password: [ null, [ Validators.required ] ]
        });
    }
}    
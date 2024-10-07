import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { StockServiceService } from '../stock-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    showLoginForm: boolean = true; // State conditional
    constructor(private stockService: StockServiceService ,private router: Router) {}

    // Convert login and register form 
    toggleForm(): void {
        this.showLoginForm = !this.showLoginForm;
    }

    // Handle login form
    username: string = '';
    password: string = '';
    errorMessage: string = '';
    firstname: string = '';
    lastname: string = '';
    email: string = '';
    phone: string = '';
    birth: Date | null = null;
    organization: string = '';
    location: string = '';
    username_reg: string = '';
    password_reg: string = '';
    onLogin(): void {
        this.stockService.login(this.username, this.password).subscribe(
            response => {
              // Handle login successful
              console.log('Login successful:', response);
              var user = response.user
              var token = response.token
              this.stockService.setUserInfo(user); // Stored access user
              this.stockService.setToken(token); // Stored token
              this.router.navigate(['/dashboard']); // Navigate dashboard
            },
            error => {
              // Handle login failure
              console.error('Login failed:', error);
              this.errorMessage = 'Invalid username or password';
              // Reset input
                setTimeout(() => {
                    this.username = ''; 
                    this.password = '';
                    this.errorMessage = ''; 
                }, 1500);
            }
        );
    }

    // Handle register form
    onRegister(): void {
        const user = {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            phone: this.phone,
            birth: null,
            organization: null,
            location: null,
            username: this.username_reg,
            password: this.password_reg
        };
        this.stockService.register(user).subscribe(
            response => {
                alert(response.message || "Registration successful!");
                this.router.navigate(['/login']);
                this.toggleForm();
            },
            error => {
                alert(error); 
            }
        );
    }
}
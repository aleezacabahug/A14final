import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Add HttpClientModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http
      .post('http://localhost:3000/api/login', { username: this.username, password: this.password })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Invalid credentials';
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.http
      .get('http://localhost:3000/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          this.message = response.message;
        },
        error: () => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        },
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

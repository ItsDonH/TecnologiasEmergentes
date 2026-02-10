import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule ], // 
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboard implements OnInit {

  yaVoto: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const valor = localStorage.getItem('yaVoto');
    this.yaVoto = valor === 'true';
  }

  irAVotar() {
    if (this.yaVoto) {
      alert('Usted ya votó');
      return;
    }

    this.router.navigate(['/votacion']);
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
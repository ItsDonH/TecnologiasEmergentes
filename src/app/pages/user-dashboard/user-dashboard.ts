import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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

  mostrarAlerta = false;

irAVotar() {
  if (this.yaVoto) {
    this.mostrarAlerta = true;
    setTimeout(() => this.mostrarAlerta = false, 4000); // se oculta solo
    return;
  }
  this.router.navigate(['/votacion']);
}

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
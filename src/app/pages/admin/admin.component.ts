import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent {

  constructor(private router: Router) {}

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

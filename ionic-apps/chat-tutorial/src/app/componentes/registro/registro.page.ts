import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public email: string;
  public password: string;
  public nombre: string;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  onSubmitRegister() {
    this.authService.register(this.nombre, this.email, this.password)
      .then(auth => {
        this.router.navigate(['/home']);
        console.log(auth);
      })
      .catch(err => {
        console.info("error", err);
      })
  }
}

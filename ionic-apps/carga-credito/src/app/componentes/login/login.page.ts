import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  splash = true;
  email: string;
  password: string;

  usuarios: Array<any> = [
    { id: 0, nombre: "admin", correo: "admin@admin.com", clave: 111111 },
    { id: 1, nombre: "invitado", correo: "invitado@invitado.com", clave: 222222 },
    { id: 2, nombre: "usuario", correo: "usuario@usuario.com", clave: 333333 },
    { id: 3, nombre: "anonimo", correo: "anonimo@anonimo.com", clave: 444444 },
    { id: 4, nombre: "tester", correo: "tester@tester.com", clave: 555555 }
  ]

  constructor(private authService: AuthService, public router: Router, private toast: ToastService) { }

  ngOnInit() {
    setTimeout(() => this.splash = false, 4000);
  }

  onChange(id) {
    this.email = this.usuarios[id].correo;
    this.password = this.usuarios[id].clave;
  }

  onSubmitLogin() {
    this.authService.login(this.email, this.password)
      .then(res => {
        this.router.navigate(['/home']);
      })
      .catch(error => {
        this.toast.errorToast("Los datos son incorrectos o no existe el usuario");
      })

  }
}

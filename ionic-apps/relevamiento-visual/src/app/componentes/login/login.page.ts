import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // splash = true;
  email: string;
  password: string;

  constructor(private authService: AuthService, public router: Router) { }

  ngOnInit() {
    // setTimeout(() => this.splash = false, 4000);
  }

  onSubmitLogin() {
    this.authService.login(this.email, this.password)
      .then(res => {
        this.router.navigate(['/home']);
      })
      .catch(error => {
        alert("Los datos son incorrectos o no existe el usuario");
      })

  }

}

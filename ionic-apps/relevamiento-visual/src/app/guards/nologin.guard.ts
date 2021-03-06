import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators'
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class NologinGuard implements CanActivate {
  constructor(private Afauth: AngularFireAuth, private route: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.Afauth.authState.pipe(map(auth => {
      if (isNullOrUndefined(auth)) {
        return true;
      }
      else{
        this.route.navigate(['/home']);
        return false;
      }
      // console.log(auth)
    }))
  }
}

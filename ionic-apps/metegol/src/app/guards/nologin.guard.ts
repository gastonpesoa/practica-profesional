import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class NologinGuard implements CanActivate {

  constructor(private authAF: AngularFireAuth, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authAF.authState.pipe(map(auth => {
      if (isNullOrUndefined(auth)) {
        return true;
      } else {
        this.router.navigate(['/home'])
        return false;
      }
    }))
  }
}

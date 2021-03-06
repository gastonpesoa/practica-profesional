import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NologinGuard } from './guards/nologin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard]},
  { path: 'login', loadChildren: './componentes/login/login.module#LoginPageModule', canActivate: [NologinGuard]},
  { path: 'registro', loadChildren: './componentes/registro/registro.module#RegistroPageModule', canActivate: [NologinGuard]},
  { path: 'galeria', loadChildren: './componentes/galeria/galeria.module#GaleriaPageModule', canActivate: [AuthGuard]},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

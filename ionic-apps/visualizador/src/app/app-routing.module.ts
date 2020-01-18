import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NologinGuard } from './guards/nologin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard]},
  {
    path: 'galeria',
    loadChildren: () => import('./componentes/galeria/galeria.module').then( m => m.GaleriaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./componentes/login/login.module').then( m => m.LoginPageModule),
    canActivate: [NologinGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./componentes/registro/registro.module').then( m => m.RegistroPageModule),
    canActivate: [NologinGuard]
  },
  {
    path: 'list/cosasLindas',
    loadChildren: () => import('./componentes/list/list.module').then( m => m.ListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list/cosasFeas',
    loadChildren: () => import('./componentes/list/list.module').then( m => m.ListPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

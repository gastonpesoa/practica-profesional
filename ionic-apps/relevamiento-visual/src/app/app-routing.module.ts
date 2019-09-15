import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
    // canActivate: [AuthGuard]
  },
  {
    path: 'login', loadChildren: './componentes/login/login.module#LoginPageModule'
    // canActivate: [NologinGuard]
  },
  {
    path: 'registro', loadChildren: './componentes/registro/registro.module#RegistroPageModule'
    // canActivate: [NologinGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

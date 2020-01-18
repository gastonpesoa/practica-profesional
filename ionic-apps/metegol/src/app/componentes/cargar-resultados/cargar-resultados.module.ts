import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CargarResultadosPage } from './cargar-resultados.page';

const routes: Routes = [
  {
    path: '',
    component: CargarResultadosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CargarResultadosPage]
})
export class CargarResultadosPageModule {}

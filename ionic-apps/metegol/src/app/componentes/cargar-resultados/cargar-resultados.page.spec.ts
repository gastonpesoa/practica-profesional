import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarResultadosPage } from './cargar-resultados.page';

describe('CargarResultadosPage', () => {
  let component: CargarResultadosPage;
  let fixture: ComponentFixture<CargarResultadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarResultadosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarResultadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

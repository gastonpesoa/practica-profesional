import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPartidoPage } from './crear-partido.page';

describe('CrearPartidoPage', () => {
  let component: CrearPartidoPage;
  let fixture: ComponentFixture<CrearPartidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPartidoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPartidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

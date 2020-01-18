import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TableroComponent } from './tablero.component';

describe('TableroComponent', () => {
  let component: TableroComponent;
  let fixture: ComponentFixture<TableroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableroComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TableroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

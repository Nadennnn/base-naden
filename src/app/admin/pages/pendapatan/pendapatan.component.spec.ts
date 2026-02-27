import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendapatanComponent } from './pendapatan.component';

describe('PendapatanComponent', () => {
  let component: PendapatanComponent;
  let fixture: ComponentFixture<PendapatanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendapatanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendapatanComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengeluaranComponent } from './pengeluaran.component';

describe('PengeluaranComponent', () => {
  let component: PengeluaranComponent;
  let fixture: ComponentFixture<PengeluaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PengeluaranComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PengeluaranComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

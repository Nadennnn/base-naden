import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlokasiComponent } from './alokasi.component';

describe('AlokasiComponent', () => {
  let component: AlokasiComponent;
  let fixture: ComponentFixture<AlokasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlokasiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlokasiComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

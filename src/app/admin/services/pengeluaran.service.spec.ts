import { TestBed } from '@angular/core/testing';

import { PengeluaranService } from './pengeluaran.service';

describe('PengeluaranService', () => {
  let service: PengeluaranService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PengeluaranService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PendapatanService } from './pendapatan.service';

describe('PendapatanService', () => {
  let service: PendapatanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendapatanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

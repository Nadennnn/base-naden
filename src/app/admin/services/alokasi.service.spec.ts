import { TestBed } from '@angular/core/testing';

import { AlokasiService } from './alokasi.service';

describe('AlokasiService', () => {
  let service: AlokasiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlokasiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

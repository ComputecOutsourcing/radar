import { TestBed } from '@angular/core/testing';

import { serviciosService } from './servicios.service';

describe('DepartamentoService', () => {
  let service: serviciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(serviciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

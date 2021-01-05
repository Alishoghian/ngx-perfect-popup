import { TestBed } from '@angular/core/testing';

import { PerfectPopupService } from './perfect-popup.service';

describe('PerfectPopupService', () => {
  let service: PerfectPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfectPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

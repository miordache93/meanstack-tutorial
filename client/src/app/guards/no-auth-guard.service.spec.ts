import { TestBed } from '@angular/core/testing';

import { NoAuthGuardService } from './no-auth-guard.service';

describe('NoAuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoAuthGuardService = TestBed.get(NoAuthGuardService);
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { BackendSearchService } from './backend-search.service';

describe('BackendSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendSearchService]
    });
  });

  it('should be created', inject([BackendSearchService], (service: BackendSearchService) => {
    expect(service).toBeTruthy();
  }));
});

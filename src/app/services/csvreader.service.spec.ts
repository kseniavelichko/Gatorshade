import { TestBed } from '@angular/core/testing';

import { CsvreaderService } from './csvreader.service';

describe('CsvreaderService', () => {
  let service: CsvreaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvreaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

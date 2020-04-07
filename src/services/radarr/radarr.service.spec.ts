import { Test, TestingModule } from '@nestjs/testing';
import { RadarrService } from './radarr.service';

describe('RadarrService', () => {
  let service: RadarrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RadarrService],
    }).compile();

    service = module.get<RadarrService>(RadarrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

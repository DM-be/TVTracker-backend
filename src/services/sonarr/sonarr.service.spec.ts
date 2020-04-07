import { Test, TestingModule } from '@nestjs/testing';
import { SonarrService } from './sonarr.service';

describe('SonarrService', () => {
  let service: SonarrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SonarrService],
    }).compile();

    service = module.get<SonarrService>(SonarrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

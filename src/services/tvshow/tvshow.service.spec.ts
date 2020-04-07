import { Test, TestingModule } from '@nestjs/testing';
import { TvshowService } from './tvshow.service';

describe('TvshowService', () => {
  let service: TvshowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TvshowService],
    }).compile();

    service = module.get<TvshowService>(TvshowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

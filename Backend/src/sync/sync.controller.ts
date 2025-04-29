import { Controller, Post } from '@nestjs/common';
import { SanityService } from './sanity.service';
import { Cron } from '@nestjs/schedule';

@Controller('sync')
export class SyncController {
  constructor(private readonly sanityService: SanityService) {}

  @Post('db-to-sanity')
  async syncDbToSanity() {
    
    await this.sanityService.syncUtilisateursToSanity();
    return { message: 'Data synced from database to Sanity' };
  }

  @Post('sanity-to-db')
  async syncSanityToDb() {
   
    await this.sanityService.syncUtilisateursFromSanity();

    return { message: 'Data synced from Sanity to database' };
  }
// Sync database to Sanity every 30 minutes
@Cron('0,30 * * * *')
async handleDbToSanityCron() {
  const currentTime = new Date().toLocaleString();
  console.log(`Running scheduled DB to Sanity sync at ${currentTime}...`);
  await this.syncDbToSanity();
}

// Sync Sanity to database every 30 minutes (runs at the same time)
@Cron('0,30 * * * *')
async handleSanityToDbCron() {
  const currentTime = new Date().toLocaleString();
  console.log(`Running scheduled Sanity to DB sync at ${currentTime}...`);
  await this.syncSanityToDb();
}

}

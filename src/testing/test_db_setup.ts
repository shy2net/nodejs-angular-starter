import { InjectorService } from '@tsed/di';

import { generateMockRootUser } from '../../shared/testing/mock/user.mock';
import { saveUser } from '../misc/utils';
import { UserProfileDbModel } from '../models/user-profile.db.model';
import { DatabaseService } from '../services/db.service';

export class TestDBSetup {
  private dbService: DatabaseService;
  static instance: TestDBSetup;

  constructor(private injector: InjectorService) {
    this.dbService = injector.get(DatabaseService);
    TestDBSetup.instance = this;
  }

  /**
   * Setup the database with mocks and required data.
   */
  async setup(): Promise<void> {
    await this.format();
    await this.createUsers();
  }

  /**
   * Cleans up the database from any data.
   */
  async format(): Promise<void> {
    await UserProfileDbModel.deleteMany({});
  }

  /**
   * Create mock users required for the api tests to run.
   */
  async createUsers(): Promise<void> {
    // Create a root user which we can connect later to
    const rootUser = generateMockRootUser();

    await saveUser(rootUser);
  }

  /**
   * Cleans up the database with any 'unrelated' mock objects, which are not the required
   * mocks. This is required in order to perform clean api tests.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async cleanup(): Promise<void> {}
}

export async function initTestDB(
  injector: InjectorService
): Promise<TestDBSetup> {
  const mockSetup = new TestDBSetup(injector);
  await mockSetup.setup();
  return mockSetup;
}

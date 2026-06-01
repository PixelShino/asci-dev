import * as migration_20260601_134019_initial from './20260601_134019_initial';
import * as migration_20260601_145828_leads from './20260601_145828_leads';

export const migrations = [
  {
    up: migration_20260601_134019_initial.up,
    down: migration_20260601_134019_initial.down,
    name: '20260601_134019_initial',
  },
  {
    up: migration_20260601_145828_leads.up,
    down: migration_20260601_145828_leads.down,
    name: '20260601_145828_leads'
  },
];

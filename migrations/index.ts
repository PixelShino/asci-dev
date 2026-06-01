import * as migration_20260601_134019_initial from './20260601_134019_initial';

export const migrations = [
  {
    up: migration_20260601_134019_initial.up,
    down: migration_20260601_134019_initial.down,
    name: '20260601_134019_initial'
  },
];

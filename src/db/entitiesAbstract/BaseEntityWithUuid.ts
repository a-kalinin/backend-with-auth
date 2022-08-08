import {
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityWithDates } from './EntityWithDates.js';
import { UUID } from '../../@types/string.js';

export abstract class BaseEntityWithUuid extends EntityWithDates {
  @PrimaryGeneratedColumn('uuid')
    id: UUID;
}

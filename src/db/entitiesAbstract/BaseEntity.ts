import {
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityWithDates } from './EntityWithDates.js';

export abstract class BaseEntity extends EntityWithDates {
  @PrimaryGeneratedColumn()
    id: number;
}

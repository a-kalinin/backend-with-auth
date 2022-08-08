import {
  Entity,
  Column,
  Index,
  Relation,
  OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessToken } from './AccessToken.js';
import { EmailT, UUID } from '../../@types/string.js';
import { EntityWithDates } from '../entitiesAbstract/EntityWithDates.js';
import { ActivationCode } from './ActivationCode.js';

export enum UserScope {
  profile = 'profile',
}

@Entity('users')
export class User extends EntityWithDates {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'user_pkey' })
    id: UUID;

  @Column({ length: 100 })
  @Index('user-email-idx', { unique: true })
    email: EmailT;

  @Column({ nullable: true, length: 100 })
    firstName: string;

  @Column({ nullable: true, length: 100 })
    middleName: string;

  @Column({ nullable: true, length: 100 })
    lastName: string;

  @Column({ length: 30 })
    passwordSalt: string;

  @Column({ length: 50 })
    passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserScope,
    enumName: 'UserScope', // useful when used in several tables to avoid multiple enum creations
    default: [UserScope.profile],
  })
    scopes: UserScope[];

  @Column({ default: false })
    isActivated: boolean;

  @OneToMany(
    () => ActivationCode,
    (code) => code.user,
    { cascade: true },
  )
    activationCodes: Relation<ActivationCode>[];

  @OneToMany(
    () => AccessToken,
    (token) => token.user,
    { cascade: true },
  )
    accessTokens: Relation<AccessToken>[];
}

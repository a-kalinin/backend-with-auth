import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  Relation,
} from 'typeorm';
import { User } from './User.js';

@Entity('tokens')
export class AccessToken {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'token_pkey' })
    id: number;

  @Column()
  @Index('access-token-idx', { unique: true })
    accessToken: string;

  @Column({ type: 'timestamp without time zone' })
    accessTokenExpiresOn: Date;

  @Index('refresh-token-idx', { unique: true })
  @Column()
    refreshToken: string;

  @Column({ type: 'timestamp without time zone' })
    refreshTokenExpiresOn: Date;

  @ManyToOne(() => User, (user) => user.accessTokens)
    user: Relation<User>;
}

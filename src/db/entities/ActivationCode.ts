import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  Relation,
  Generated,
} from 'typeorm';
import { User } from './User.js';

@Entity('activation_codes')
export class ActivationCode {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'activation_code_pkey' })
    id: number;

  @Column()
  @Generated('uuid')
  @Index('activation_code_idx', { unique: true })
    code: string;

  @Column({ type: 'timestamp without time zone' })
    createdAt: Date;

  @Column({ type: 'timestamp without time zone' })
    expiresOn: Date;

  @ManyToOne(() => User, (user) => user.activationCodes)
    user: Relation<User>;
}

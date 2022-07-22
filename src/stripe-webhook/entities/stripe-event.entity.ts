import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class StripeEvent {
  @PrimaryColumn()
  id: string;
}

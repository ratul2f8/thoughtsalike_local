import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";
import { Updoot } from "./Updoot";
@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;
  
  @Field(() => Int)
  @Column({type: 'int', default: 0})
  points!: number;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @Field()
  @ManyToOne(() => User, user => user.posts)
  creator: User

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt = Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = Date;

  @Field(() => Int, {nullable: true})
  voteStatus: number
}


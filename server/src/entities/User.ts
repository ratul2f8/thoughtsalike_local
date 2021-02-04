import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Field, Int, ObjectType } from 'type-graphql';
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity{

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unique: true })
    username!: string;

    @OneToMany(() => Post, post => post.creator)
    posts: Post[]
    
    @Field()
    @Column({ unique: true})
    email!: string;
    //Since we don't want to expose our password or perform any kind of request 
    //to get the password, we will not declare it with @Field() annotation
    //or we will not include it in our graphql server
    //just our database will have a column named as password and it will also
    //be a hashed value
    @Column()
    password: string;

    @OneToMany(() => Updoot, (updoot) => updoot.user)
    updoots: Updoot[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt = Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = Date;
}
import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";
import { UserResponse } from "../utils/FieldError";
import { checkRequirements, validateEmail } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { FORGET_PASSWORD_PREFIX } from "../constants";
import { v4 } from 'uuid';
import { getConnection } from "typeorm";
@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  email: string;
}
@InputType()
export class LogInObject{
  @Field()
  identifier: string;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token")
    token: string,
    @Arg("newPassword")
    newPassword: string,
    @Ctx()
    { redis,req }: MyContext
  ):Promise<UserResponse>{
    if(newPassword.length <= 2){
      return {
        errors : [
          {
            field: "password",
            message: "Length of the password must be greater than two!!"
          }
        ]
      }
    }
    const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
    if(!userId){
      return {
        errors: [
          {
            field: "token",
            message: "Token expired!!"
          }
        ]
      }
    }
    const userIdNum = parseInt(userId);
    const user  = await User.findOne(userIdNum);
    if(!user){
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists!!"
          }
        ]
      }
    }
    
    await User.update({id : userIdNum}, {
      password: await argon2.hash(newPassword)
    })
    //delete redis key after updating
    await redis.del(FORGET_PASSWORD_PREFIX + token);
    //login user after changing the password
    req.session.userId = user.id;
    return {
      user
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email")
    email: string,
    @Ctx()
    { redis}:MyContext
  ){
    let user = await User.findOne({where: {email: email}});
    if(!user){
      //if the user doesn't exist
      return true
    }
    const token = v4();
    await redis.set(FORGET_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      36000*60*24*3
      );//3 days
    await sendEmail(email, `<a href='http://localhost:3000/change-password/${token}'>Reset Password</a>`)
    return true;
  }
  
  @Mutation(() => UserResponse)
  async register(
    @Arg("options")
    options: UsernamePasswordInput,
    @Ctx()
    { req }: MyContext
  ): Promise<UserResponse> {
    let validator: UserResponse = checkRequirements(options);
    if (validator.errors?.length === 0) {
      let currentUser = await User.findOne({where: {username: options.username}});
      if (currentUser) {
        return {
          errors: [
            {
              field: "username",
              message: "Username already taken!",
            },
          ],
        };
      } else {
        currentUser = undefined;
        currentUser = await User.findOne({where: {email: options.email}});
        if (currentUser) {
          return {
            errors: [
              {
                field: "email",
                message: "Email already taken!",
              },
            ],
          };
        } else {
          const hashedPassword = await argon2.hash(options.password);
          let user;
          try {
            const result = await getConnection().createQueryBuilder().insert().into(User).values({
              username: options.username,
                password: hashedPassword,
                email: options.email,
            })
            .returning("*")
            .execute();
            user = result.raw[0];
          } catch (err) {
            return {
              errors: [
                {
                  field: "internal",
                  message: "Unexpected error happened!",
                },
              ],
            };
          }
          req.session.userId = user.id;
          return {
            user,
          };
        }
      }
    } else {
      return {
        errors: validator.errors,
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options")
    options: LogInObject,

    @Ctx()
    { req }: MyContext
  ): Promise<UserResponse> {
    let user;
    if(!validateEmail(options.identifier)){
      user = await User.findOne({where: { username: options.identifier }});
      if (!user) {
        return {
          errors: [{ field: "username", message: "Username doesn't exist!" }],
        };
      }
    }else{
      user = await User.findOne({where: { email: options.identifier }});;
      if (!user) {
        return {
          errors: [{ field: "email", message: "Email doesn't exist!" }],
        };
      }
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "Incorrect password!" }],
      };
    }
    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Query(() => User, { nullable: true })
  async me(
    @Ctx()
    { req }: MyContext
  ): Promise<User | undefined> {
    if (!req.session.userId) {
      return undefined;
    }
    const user = await User.findOne(req.session.userId)
    return user;
  }

  @Query(() => User, {nullable: true})
  async findUserById(
    @Arg("id")
    id: string
  ):Promise<User|null>{
    const user = await User.findOne(parseInt(id));
    if(user){
      return user
    }
    return null;
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx()
    { req, res }: MyContext
  ) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }
}

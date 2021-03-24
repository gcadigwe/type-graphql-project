import { User } from "../../entity/User";
import bcrypt from "bcryptjs";
import { Resolver, Query, Mutation, Arg } from "type-graphql";

@Resolver()
export class RegisterResolver {
  @Query(() => String, { nullable: true })
  async hello() {
    return "Hello world";
  }

  @Mutation(() => User)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("password") password: string,
    @Arg("email") email: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}

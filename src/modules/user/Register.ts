import { User } from "../../entity/User";
import { RegisterInput } from "./register/Registerinput";
import bcrypt from "bcryptjs";
import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import { isAuth } from "../Middleware/isAuth";
import { sendEmail } from "../utils/utils.sendemail";
import { createConfirmationUrl } from "../utils/createconfirmation";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth)
  @Query(() => String, { nullable: true })
  async hello() {
    return "Hello world";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.id));

    return user;
  }
}

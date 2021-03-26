import { User } from "../../entity/User";
import { Resolver, Mutation, Arg } from "type-graphql";
import { redis } from "../../redis";
import { confirmationPrefix } from "../constants/prefix";

@Resolver()
export class ConfirmResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(confirmationPrefix + token);

    if (!userId) {
      return false;
    }

    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });

    await redis.del(token);
    return true;
  }
}

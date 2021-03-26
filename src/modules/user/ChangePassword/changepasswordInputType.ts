import { Field, InputType } from "type-graphql";
import { passwordInput } from "../../shared/passwordinput";

@InputType()
export class ChangePasswordInput extends passwordInput {
  @Field()
  token: string;
}

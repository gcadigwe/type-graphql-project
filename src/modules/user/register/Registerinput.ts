// import { MaxLength, Length } from "class-validator";
import { Length, IsEmail } from "class-validator";
import { passwordInput } from "../../shared/passwordinput";
import { Field, InputType } from "type-graphql";
import { isEmailAlreadyUsed } from "./isEmailAlreadyUsed";

@InputType()
export class RegisterInput extends passwordInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @isEmailAlreadyUsed({ message: "email is already in use" })
  email: string;
}

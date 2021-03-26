import { Min } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class passwordInput {
  @Field()
  @Min(5)
  password: string;
}

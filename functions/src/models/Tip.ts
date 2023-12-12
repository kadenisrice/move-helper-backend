import { ObjectId } from "mongodb";

export default interface Tip {
  _id?: ObjectId;
  uuid: string;
  from: string;
  text: string;
  photoURL?: string;
}

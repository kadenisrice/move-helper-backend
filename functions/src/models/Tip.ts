import { ObjectId } from "mongodb";

export default interface Tip {
  _id?: ObjectId;
  uuid: string;
  from: string;
  fromNickname?: string;
  from_id: ObjectId;
  text: string;
  photoURL?: string;
  date: Date;
  stars: string[];
}

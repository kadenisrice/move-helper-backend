import { ObjectId } from "mongodb";
import BoxSet from "./BoxSet";

export default interface Account {
  _id?: ObjectId;
  uid: string;
  name?: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL?: string;
  toAddress: Address;
  fromAddress: Address;
  tasks: Task[];
  orders: Order[];
  expenses: Expense[];
  boxes: Box[];
  boxSet: BoxSet[];
}

export interface Box {
  uuid: string;
  length: string;
  width: string;
  height: string;
  distance_unit: string;
  weight: string;
  mass_unit: string;
  quantity: number;
}

export interface Task {
  uuid: string;
  name: string;
  content: string;
  deadline: string;
}

interface Order {
  trackingID: string;
  name: string;
  deliveryDate: string;
}

interface Expense {
  name: string;
  price: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

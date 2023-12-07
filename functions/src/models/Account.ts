import { ObjectId } from "mongodb";

export default interface Account {
  _id?: ObjectId;
  uid: string;
  name?: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  toAddress: Address;
  fromAddress: Address;
  tasks: Task[];
  orders: Order[];
  expenses: Expense[];
}

interface Task {
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
  zip: number;
}

import { ObjectId } from "mongodb";

export default interface Account {
  _id?: ObjectId;
  uid: string;
  name?: string;
  displayName: string;
  email: string;
  phoneNumber: number;
  toAddress: string;
  fromAddress: string;
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

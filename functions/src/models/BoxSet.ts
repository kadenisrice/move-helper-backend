import { Box } from "./Account";

export default interface BoxSet {
  uuid: string;
  name: string;
  maxSquareFeet?: number;
  boxes: Box[];
}

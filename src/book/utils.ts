import BigNumber from "bignumber.js";
import { BookRow, EventMessage, SnapshotMessage, UpdateMessage } from "./types";

export function isEventMessage(x: any): x is EventMessage {
  return "event" in x;
}

export function isSnapshotMessage(x: any): x is SnapshotMessage {
  if (!Array.isArray(x)) {
    return false;
  }

  return Array.isArray(x[1]) && Array.isArray(x[1][0]);
}

export function isUpdateMessage(x: any): x is UpdateMessage {
  if (!Array.isArray(x)) {
    return false;
  }

  return Array.isArray(x[1]) && typeof x[1][0] === "number";
}

export function calculateDepths(bookRows: BookRow[]): number[] {
  let result: number[] = [];
  let acc = new BigNumber(0);
  bookRows.forEach(({ amount }, i) => {
    acc = acc.plus(amount);
    result[i] = +acc;
  });

  return result;
}

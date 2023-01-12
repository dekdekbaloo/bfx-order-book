export type BookRow = {
  price: number;
  count: number;
  amount: number;
};

export type BookData = [price: number, count: number, amount: number];

export type EventMessage = { event: string; chanId: number };
export type SnapshotMessage = [channelID: number, data: BookData[]];
export type UpdateMessage = [channelID: number, data: BookData];

export type BookMessage = EventMessage | SnapshotMessage | UpdateMessage;

export type SortedBookRows = { bids: BookRow[]; asks: BookRow[] };

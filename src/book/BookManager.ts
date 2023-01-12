import _ from "lodash";
import { BookData, BookRow, SortedBookRows } from "./types";
import { isEventMessage, isSnapshotMessage, isUpdateMessage } from "./utils";

const bfxBookURL = "wss://api-pub.bitfinex.com/ws/2";

class BookManager {
  ws!: WebSocket;

  channelID!: number;

  bidPrices: number[] = [];

  bids: { [price: string]: BookRow } = {};

  askPrices: number[] = [];

  asks: { [price: string]: BookRow } = {};

  onUpdate?: (bookRows: SortedBookRows) => any;

  async start(precision = "P0") {
    this.ws = new WebSocket(bfxBookURL);

    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          event: "subscribe",
          channel: "book",
          symbol: "tBTCUSD",
          prec: precision,
        })
      );
    };

    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (isEventMessage(data)) {
        this.channelID = data.chanId;
      } else if (isSnapshotMessage(data)) {
        this.handleSnapshotMessage(data[1]);
      } else if (isUpdateMessage(data)) {
        this.handleUpdateMessage(data[1]);
      }
    };
  }

  handleSnapshotMessage(snapshot: BookData[]) {
    snapshot.forEach(([price, count, amount]) => {
      if (count === 0) return;

      if (amount > 0) {
        this.bidPrices.push(price);
        this.bids[price] = { price, count, amount };
      } else if (amount < 0) {
        this.askPrices.push(price);
        this.asks[price] = { price, count, amount };
      }
    });
  }

  handleUpdateMessage(bookData: BookData) {
    const [price, count, amount] = bookData;
    if (count > 0) {
      // Add / Update book row
      if (amount > 0) {
        // Bids

        // Using sorted index to implement "sorted map"
        // The bids, asks object can't be sorted deterministically in JS runtime.
        // We use bidPrices, askPrices arrays are for keeping the index of prices instead.
        if (!this.bids[price]) {
          const index = _.sortedIndexBy(this.bidPrices, price, (p) => -p);
          this.bidPrices.splice(index, 0, price);
        }

        this.bids[price] = { price, count, amount };
      } else {
        // Asks

        if (!this.asks[price]) {
          const index = _.sortedIndexBy(this.askPrices, price);
          this.askPrices.splice(index, 0, price);
        }

        this.asks[price] = { price, count, amount };
      }
    } else {
      // Delete book row
      if (amount > 0 && this.bids[price]) {
        delete this.bids[price];

        // Find the sorted index for the cached price in price array
        const index = _.sortedIndexBy(this.bidPrices, price, (p) => -p);
        this.bidPrices.splice(index, 1);
      } else if (amount < 0 && this.asks[price]) {
        delete this.asks[price];

        // Find the sorted index for the cached price in price array
        const index = _.sortedIndexBy(this.askPrices, price);
        this.askPrices.splice(index, 1);
      }
    }

    if (this.onUpdate) {
      this.onUpdate(this.getBooks());
    }
  }

  getBooks(): SortedBookRows {
    return {
      bids: this.bidPrices.map((price) => this.bids[price]),
      asks: this.askPrices.map((price) => this.asks[price]),
    };
  }

  // async stop() {
  //   this.ws.send(JSON.stringify({}));
  // }
}

export default BookManager;

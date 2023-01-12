import _ from "lodash";

const bfxBookURL = "wss://api-pub.bitfinex.com/ws/2";

type BookRow = {
  price: number;
  count: number;
  amount: number;
};

type BookData = [price: number, count: number, amount: number];

class BookManager {
  ws!: WebSocket;

  channelID!: number;

  bidPrices: number[] = [];

  bids: { [price: string]: BookRow } = {};

  askPrices: number[] = [];

  asks: { [price: string]: BookRow } = {};

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
      console.log(JSON.parse(msg.data));
    };
  }

  // async stop() {
  //   this.ws.send(JSON.stringify({}));
  // }
}

export default BookManager;

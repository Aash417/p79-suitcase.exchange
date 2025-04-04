export type SubscribeMessage = {
   method: 'SUBSCRIBE';
   data: string[];
};

export type UnsubscribeMessage = {
   method: 'UNSUBSCRIBE';
   data: string[];
};

export type IncomingMessage = SubscribeMessage | UnsubscribeMessage;

export type TickerUpdateMessage = {
   type: 'ticker';
   data: {
      c?: string;
      h?: string;
      l?: string;
      v?: string;
      V?: string;
      s?: string;
      id: number;
      e: 'ticker';
   };
};

export type DepthUpdateMessage = {
   type: 'depth';
   data: {
      b?: [string, string][];
      a?: [string, string][];
      id: number;
      e: 'depth';
   };
};

export type OutgoingMessage = TickerUpdateMessage | DepthUpdateMessage;

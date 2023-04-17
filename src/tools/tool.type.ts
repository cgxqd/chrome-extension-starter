export type SendMessageArgs = {
  cmd: string;
  data?: any;
};

export type SendMessage = ({ cmd, data }: SendMessageArgs, cb?: (...args: any) => void) => void;

type ReceiveMessageCbArgs = {
  data: any;
  sender: chrome.runtime.MessageSender;
  response: (response?: any) => void;
};
export type ReceiveMessageCb = ({ data, sender, response }: ReceiveMessageCbArgs) => any;

export type ReceiveMessage = (cmd: string, cb: ReceiveMessageCb) => void;

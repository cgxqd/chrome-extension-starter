export type SendMessage = (
  cmd: string,
  data: any,
  cb?: (...args: any) => void,
  toTab?: any,
) => void;

type ReceiveMessageCbArgs = {
  data: any;
  sender: chrome.runtime.MessageSender;
  response: (response?: any) => void;
};
export type ReceiveMessageCb = ({ data, sender, response }: ReceiveMessageCbArgs) => any;

export type ReceiveMessage = (cmd: string, cb: ReceiveMessageCb) => void;

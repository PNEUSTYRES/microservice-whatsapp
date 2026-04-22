import { z } from "zod";

export const messageTextSchema = z.object({
  body: z.string().min(1),
  tenant_id: z.uuid(),
});

export type MessageTextDTO = z.infer<typeof messageTextSchema>;

export class MessageText {
  private _body: string;
  private _tenant_id: string;

  constructor(props: MessageTextDTO) {
    const data = messageTextSchema.parse(props);
    this._body = data.body;
    this._tenant_id = data.tenant_id;
  }

  get body() {
    return this._body;
  }

  toDTO(): MessageTextDTO {
    return {
      body: this._body,
      tenant_id: this._tenant_id,
    };
  }
}

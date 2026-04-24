import { z } from "zod";
import { DomainError } from "../utils/DomainError";

export const sessionSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2, "Nome muito curto").max(150, "Nome muito longo"),
  descricao: z.string().max(500, "Descrição muito longa").optional(),
  qrcode: z.string().optional(),
  tenant_id: z.uuid(),
  created_at: z.date().optional(),
});

export type SessionDTO = z.infer<typeof sessionSchema>;

export class Session {
  private _id: string;
  private _name: string;
  private _descricao?: string;
  private _qrcode?: string;
  private _tenant_id: string;
  private _created_at?: Date;

  private constructor(props: SessionDTO) {
    this._id = props.id;
    this._name = props.name;
    this._tenant_id = props.tenant_id;

    if (props.descricao) {
      this._descricao = props.descricao;
    }

    if (props.qrcode) {
      this._qrcode = props.qrcode;
    }

    this._created_at = props.created_at;
  }

  static create(props: Omit<SessionDTO, "created_at">): Session {
    const data = sessionSchema.omit({ created_at: true }).parse(props);

    return new Session({
      ...data,
      created_at: new Date(),
    });
  }

  static restore(props: SessionDTO): Session {
    const data = sessionSchema.parse(props);

    if (!data.id) {
      throw new DomainError("Session precisa de ID");
    }

    return new Session(data);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get descricao() {
    return this._descricao;
  }

  get qrcode() {
    return this._qrcode;
  }

  get tenant_id() {
    return this._tenant_id;
  }

  get createdAt() {
    return this._created_at;
  }

  set name(value: string) {
    this._name = sessionSchema.shape.name.parse(value);
  }

  set descricao(value: string | undefined) {
    if (!value) return;
    this._descricao = sessionSchema.shape.descricao.parse(value);
  }

  set qrcode(value: string | undefined) {
    if (!value) return;
    this._qrcode = value;
  }

  rename(newName: string) {
    this._name = sessionSchema.shape.name.parse(newName);
  }

  changeDescricao(newDescricao: string) {
    this._descricao = sessionSchema.shape.descricao.parse(newDescricao);
  }

  changeQrCode(newQrCode: string) {
    this._qrcode = newQrCode;
  }

  toDTO(): SessionDTO {
    return {
      id: this._id,
      name: this._name,
      descricao: this._descricao,
      qrcode: this._qrcode,
      tenant_id: this._tenant_id,
      created_at: this._created_at,
    };
  }
}

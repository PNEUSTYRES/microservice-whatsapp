import {
  WebhookWhatsapp,
  WhatsAppMessage,
  WhatsAppMessageAudio,
  WhatsAppMessageContext,
  WhatsAppMessageDocument,
  WhatsAppMessageImage,
  WhatsAppMessageSticker,
  WhatsAppMessageText,
  WhatsAppMessageVideo,
  WhatsAppMessageVoice,
} from "@/domain/repositories/IWhatsappAdapter";
import { WAMessage } from "@whiskeysockets/baileys";

export class BaileysToWhatpyMapper {
  static map(messages: WAMessage[]): WebhookWhatsapp | null {
    const mappedMessages = messages
      .map((msg: WAMessage) => this.buildMessage(msg))
      .filter(Boolean);

    return {
      messages: mappedMessages,
      event: {
        type: "messages",
        event: "post",
      },
      channel_id: "default",
    };
  }

  private static buildMessage(msg: WAMessage): WhatsAppMessage | null {
    const base = this.buildBase(msg);

    if (!msg.message) return null;

    if (msg.message.conversation) {
      return {
        ...base,
        type: "text",
        text: this.buildTextMessage(msg.message.conversation),
      };
    }

    if (msg.message.extendedTextMessage) {
      return {
        ...base,
        type: "text",
        text: this.buildTextMessage(msg.message.extendedTextMessage.text),
        context: this.buildContext(msg.message.extendedTextMessage.contextInfo),
      };
    }

    if (msg.message.imageMessage) {
      return {
        ...base,
        type: "image",
        image: this.buildImageMessage(msg.message.imageMessage),
        context: this.buildContext(msg.message.imageMessage.contextInfo),
      };
    }
    if (msg.message.documentMessage) {
      return {
        ...base,
        type: "document",
        document: this.buildDocumentMessage(msg.message.documentMessage),
        context: this.buildContext(msg.message.documentMessage.contextInfo),
      };
    }
    if (msg.message.videoMessage) {
      return {
        ...base,
        type: "video",
        video: this.buildVideoMessage(msg.message.videoMessage),
        context: this.buildContext(msg.message.videoMessage.contextInfo),
      };
    }
    if (msg.message.audioMessage?.ptt === true) {
      return {
        ...base,
        type: "voice",
        voice: this.buildVoiceMessage(msg.message.audioMessage),
        context: this.buildContext(msg.message.audioMessage.contextInfo),
      };
    }
    if (msg.message.audioMessage) {
      return {
        ...base,
        type: "audio",
        audio: this.buildAudioMessage(msg.message.audioMessage),
        context: this.buildContext(msg.message.audioMessage.contextInfo),
      };
    }
    if (msg.message.stickerMessage) {
      return {
        ...base,
        type: "sticker",
        sticker: this.buildStickerMessage(msg.message.stickerMessage),
        context: this.buildContext(msg.message.stickerMessage.contextInfo),
      };
    }
    return null;
  }
  private static buildStickerMessage(sticker: any): WhatsAppMessageSticker {
    return {
      id: this.normalizeBase64(sticker.fileSha256) || "",
      mime_type: sticker.mimetype,
      file_size: Number(sticker.fileLength || 0),
      sha256:
        this.normalizeBase64(sticker.fileSha256 || sticker.fileEncSha256) || "",
      link: sticker.url,
      is_animated: !!sticker.isAnimated,
      is_ai_sticker: !!sticker.isAiSticker,
      is_lottie: !!sticker.isLottie,
      preview: sticker.isAnimated
        ? undefined
        : `data:${sticker.mimetype};base64,${this.normalizeBase64(
            sticker.fileSha256,
          )}`,
    };
  }
  private static buildAudioMessage(audio: any): WhatsAppMessageAudio {
    return {
      id: this.normalizeBase64(audio.fileSha256) || "",
      mime_type: audio.mimetype,
      file_size: Number(audio.fileLength || 0),
      sha256:
        this.normalizeBase64(audio.fileSha256 || audio.fileEncSha256) || "",
      link: audio.url,
      seconds: audio.seconds,
    };
  }
  private static buildVoiceMessage(audio: any): WhatsAppMessageVoice {
    return {
      id: this.normalizeBase64(audio.fileSha256) || "",
      mime_type: audio.mimetype,
      file_size: Number(audio.fileLength || 0),
      sha256:
        this.normalizeBase64(audio.fileSha256 || audio.fileEncSha256) || "",
      link: audio.url,
      seconds: audio.seconds || 0,
    };
  }

  private static buildImageMessage(image: any): WhatsAppMessageImage {
    return {
      id: this.normalizeBase64(image.fileSha256) || "",
      mime_type: image.mimetype,
      file_size: Number(image.fileLength || 0),
      sha256:
        this.normalizeBase64(image.fileSha256 || image.fileEncSha256) || "",
      caption: image.caption || "",
      width: image.width,
      height: image.height,
      link: image.url,
      preview: `data:${image.mimetype};base64,${this.normalizeBase64(image.jpegThumbnail)}`,
    };
  }
  private static buildDocumentMessage(doc: any): WhatsAppMessageDocument {
    return {
      id: this.normalizeBase64(doc.fileSha256) || "",
      mime_type: doc.mimetype,
      file_size: Number(doc.fileLength || 0),
      sha256: this.normalizeBase64(doc.fileSha256 || doc.fileEncSha256) || "",
      link: doc.url,
      file_name: doc.fileName || doc.title || "",
      filename: doc.fileName || doc.title || "",
      caption: doc.caption || "",
    };
  }
  private static buildVideoMessage(video: any): WhatsAppMessageVideo {
    return {
      id: this.normalizeBase64(video.fileSha256) || "",
      mime_type: video.mimetype,
      file_size: Number(video.fileLength || 0),
      sha256:
        this.normalizeBase64(video.fileSha256 || video.fileEncSha256) || "",
      width: video.width,
      height: video.height,
      seconds: video.seconds,
      link: video.url,
      caption: video.caption || "",
      preview: video.jpegThumbnail
        ? `data:${video.mimetype};base64,${this.normalizeBase64(
            video.jpegThumbnail,
          )}`
        : undefined,
    };
  }

  private static normalizeBase64(value: any): string {
    if (!value) return "";

    // já é string (Base64) → mantém
    if (typeof value === "string") return value;

    // é Buffer → converte pra base64
    if (Buffer.isBuffer(value)) {
      return value.toString("base64");
    }

    // é objeto tipo {0: 30, 1: 161...}
    if (typeof value === "object") {
      return Buffer.from(Object.values(value)).toString("base64");
    }

    return "";
  }

  private static buildBase(msg: WAMessage): Omit<WhatsAppMessage, "type"> {
    return {
      id: msg.key.id,
      from_me: msg.key.fromMe,
      chat_id: msg.key.remoteJidAlt,
      timestamp: msg.messageTimestamp,
      source: "baileys",
      starred: false,
      status: "sent",
      from: msg.key.remoteJidAlt?.includes("@s.whatsapp.net")
        ? msg.key.remoteJidAlt?.replace("@s.whatsapp.net", "")
        : msg.key.remoteJid?.replace("@s.whatsapp.net", ""),
      from_name: msg.pushName || "",
    } as any;
  }

  private static buildTextMessage(text: string): WhatsAppMessageText {
    return {
      body: text,
    };
  }

  private static buildContext(
    contextInfo: any,
  ): WhatsAppMessageContext | undefined {
    if (
      !contextInfo ||
      (!!contextInfo.isForwarded === false && !contextInfo.stanzaId)
    ) {
      return undefined;
    }

    return {
      forwarded: !!contextInfo.isForwarded,
      quoted_id: contextInfo.stanzaId || "",
      quoted_author: contextInfo.participant || "",
      quoted_type: "unknown",
      quoted_content: {
        // a message | text | image | etc
        body: contextInfo?.quotedMessage?.conversation,
      },
    };
  }
}

export interface BaileysMessagesUpsert {
  event: "messages.upsert";
  data: {
    messages: WAMessage[];
    type: "notify" | "append";
  };
  timestamp?: string;
}
export interface BaileysContextInfo {
  stanzaId?: string;
  participant?: string;
  isForwarded?: boolean;
  forwardingScore?: number;
  quotedMessage?: {
    conversation?: string;
    extendedTextMessage?: {
      text?: string;
    };
  };
}

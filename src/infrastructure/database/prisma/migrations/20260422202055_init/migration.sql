-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'image', 'video', 'audio', 'voice', 'document', 'reply', 'system');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url_photo" TEXT,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "from" TEXT NOT NULL,
    "from_name" TEXT NOT NULL,
    "from_me" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL,
    "forwarded" BOOLEAN NOT NULL DEFAULT false,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageText" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "MessageText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageImage" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "caption" TEXT,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "MessageImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageVideo" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "seconds" INTEGER,
    "caption" TEXT,
    "link" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "MessageVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAudio" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "seconds" INTEGER,
    "link" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "MessageAudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageDocument" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "MessageDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageContext" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "quoted_id" TEXT NOT NULL,
    "quoted_author" TEXT NOT NULL,
    "quoted_type" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "MessageContext_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_id_key" ON "Tenant"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_phone_key" ON "Contact"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "MessageText_message_id_key" ON "MessageText"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageImage_message_id_key" ON "MessageImage"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageVideo_message_id_key" ON "MessageVideo"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageAudio_message_id_key" ON "MessageAudio"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageDocument_message_id_key" ON "MessageDocument"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageContext_message_id_key" ON "MessageContext"("message_id");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageText" ADD CONSTRAINT "MessageText_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageText" ADD CONSTRAINT "MessageText_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageImage" ADD CONSTRAINT "MessageImage_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageImage" ADD CONSTRAINT "MessageImage_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageVideo" ADD CONSTRAINT "MessageVideo_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageVideo" ADD CONSTRAINT "MessageVideo_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAudio" ADD CONSTRAINT "MessageAudio_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAudio" ADD CONSTRAINT "MessageAudio_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageDocument" ADD CONSTRAINT "MessageDocument_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageDocument" ADD CONSTRAINT "MessageDocument_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageContext" ADD CONSTRAINT "MessageContext_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageContext" ADD CONSTRAINT "MessageContext_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

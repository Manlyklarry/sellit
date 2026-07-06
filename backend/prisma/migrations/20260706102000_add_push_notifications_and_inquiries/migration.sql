ALTER TABLE "listing"
ADD COLUMN "seller_user_id" TEXT,
ADD COLUMN "seller_name" TEXT,
ADD COLUMN "seller_email" TEXT;

CREATE TABLE "push_token" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "user_id" TEXT,
  "user_name" TEXT,
  "user_email" TEXT,
  "platform" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "push_token_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "listing_inquiry" (
  "id" TEXT NOT NULL,
  "listing_id" TEXT NOT NULL,
  "buyer_id" TEXT,
  "buyer_name" TEXT,
  "buyer_email" TEXT,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "listing_inquiry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "push_token_token_key" ON "push_token"("token");
CREATE INDEX "push_token_user_id_idx" ON "push_token"("user_id");
CREATE INDEX "push_token_user_email_idx" ON "push_token"("user_email");
CREATE INDEX "listing_seller_user_id_idx" ON "listing"("seller_user_id");
CREATE INDEX "listing_inquiry_listing_id_idx" ON "listing_inquiry"("listing_id");
CREATE INDEX "listing_inquiry_buyer_email_idx" ON "listing_inquiry"("buyer_email");

ALTER TABLE "listing"
ADD CONSTRAINT "listing_seller_user_id_fkey"
FOREIGN KEY ("seller_user_id") REFERENCES "user"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "push_token"
ADD CONSTRAINT "push_token_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "user"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "listing_inquiry"
ADD CONSTRAINT "listing_inquiry_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "listing"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

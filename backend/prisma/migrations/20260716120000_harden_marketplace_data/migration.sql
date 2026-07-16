CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'SOLD', 'ARCHIVED');

ALTER TABLE "listing"
ADD COLUMN "currency" VARCHAR(3) NOT NULL DEFAULT 'GHS',
ADD COLUMN "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "seller_email",
DROP COLUMN "seller_name";

DROP INDEX IF EXISTS "push_token_user_email_idx";
ALTER TABLE "push_token"
DROP COLUMN "user_email",
DROP COLUMN "user_name";

DROP INDEX IF EXISTS "listing_inquiry_buyer_email_idx";
ALTER TABLE "listing_inquiry"
DROP COLUMN "buyer_email",
DROP COLUMN "buyer_name";

UPDATE "listing_inquiry" AS inquiry
SET "buyer_id" = NULL
WHERE "buyer_id" IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM "user" WHERE "user"."id" = inquiry."buyer_id");

ALTER TABLE "listing_inquiry"
ADD CONSTRAINT "listing_inquiry_buyer_id_fkey"
FOREIGN KEY ("buyer_id") REFERENCES "user"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "listing_createdAt_idx" ON "listing"("createdAt");
CREATE INDEX "listing_categoryId_createdAt_idx" ON "listing"("categoryId", "createdAt");
CREATE INDEX "listing_status_createdAt_idx" ON "listing"("status", "createdAt");
CREATE INDEX "listing_inquiry_buyer_id_created_at_idx" ON "listing_inquiry"("buyer_id", "created_at");

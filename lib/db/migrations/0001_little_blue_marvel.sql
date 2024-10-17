ALTER TABLE "assets" ALTER COLUMN "serial_number" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "idSnipeit" integer;--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "model_number" varchar(100);--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "image" varchar(255);--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "qr" varchar(255);--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "location" varchar(100);--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "shelf" varchar(100);
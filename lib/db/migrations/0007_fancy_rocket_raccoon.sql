DROP INDEX IF EXISTS "trigram_index2";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trigram_index" ON "assets" USING gin (
		"name" gin_trgm_ops,
		"asset_tag" gin_trgm_ops,
		"serial_number" gin_trgm_ops,
		"model_number" gin_trgm_ops
	  );
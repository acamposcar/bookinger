CREATE INDEX IF NOT EXISTS "search_index" ON "assets" USING gin ((
			  setweight(to_tsvector('english', "name"), 'A') ||
			  setweight(to_tsvector('english', "asset_tag"), 'B') ||
			  setweight(to_tsvector('english', "serial_number"), 'C') ||
			  setweight(to_tsvector('english', "model_number"), 'D')
		  ));
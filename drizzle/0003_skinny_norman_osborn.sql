-- Update denominator for currencies without subunits (minor currency units)
UPDATE "currencies" SET "denominator" = 1 WHERE "id" IN (
	'CLP',  -- Chilean Peso
	'HUF',  -- Hungarian Forint
	'ISK',  -- Icelandic Króna
	'JPY',  -- Japanese Yen
	'KPW',  -- North Korean Won
	'KRW',  -- South Korean Won
	'LAK',  -- Lao Kip
	'PYG',  -- Paraguayan Guaraní
	'UZS',  -- Uzbek Som
	'VND'   -- Vietnamese Dong
);

-- Remove currencies not in the supported list (currencies.ts lines 46-99)
DELETE FROM "currencies" WHERE "id" IN (
	'AWG',  -- Aruban Florin
	'GHS',  -- Ghanaian Cedi
	'PEN',  -- Peruvian Sol
	'PYG'   -- Paraguayan Guaraní
);

import { defineConfig } from 'drizzle-kit';

const config = defineConfig({
	dialect: 'sqlite',
	driver: 'expo',
	schema: './db/schema.ts',
	out: './drizzle'
});

export default config;

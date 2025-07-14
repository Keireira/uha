const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Category mapping from category_link to UUID
const categoryMapping = {
	$ai: 'c1e7f8d6-4b2a-4f9e-8a7c-3d5e9f2b8c1a',
	$creativity: 'a2d8e5f1-9c3b-4e7f-9b8d-2c6f7e1a5d9c',
	$education: 'f3b9c4e2-5d7a-4c8e-8f9b-1a4d6e3c7b5f',
	$entertainment: 'e4a5d7f3-8b1c-4f6e-9c2d-5e8f1a7b4c9e',
	$food: 'd5c8e1f4-2a9b-4e3f-8d7c-6f9e2b5a8c1d',
	'$for-developers': 'b6f2a9e5-7c4d-4b8f-9e1a-3c5d7f8b2a6e',
	$hosting: 'c7e3d8f1-1b5a-4f9c-8e2d-4a6f9c3e7b1c',
	$magazines: 'a8d4f2e7-6c9b-4e1f-9d8a-2e5c8f1a4d7b',
	'$many-in-one': 'f9e1c5d8-3a7b-4f6e-8c9d-1d4e7a2f5c8b',
	$messengers: 'e1a6f9c2-8d4b-4e7f-9a5c-3f8e1d6a9c2e',
	'$monetization-platforms': 'd2b7e8f5-9a3c-4f1e-8d6b-5c9f2e7a8d1b',
	$music: 'c3f8d1e6-4b7a-4e9f-9c2d-6a1e4f7c8b3d',
	$utilities: 'b4e9f2d7-5c8a-4f3e-8b1d-7f2c5e9a4b8f',
	$video: 'a5d1e8f3-6b9c-4e7f-9a4d-8e3f6a1c5d9b',
	$vpn: 'f6c2d9e4-7a8b-4f5e-8c3d-9f6e2a5c8b1f'
};

const descriptionsDir = path.join(__dirname, 'assets', 'descriptions');

// Read all JSON files
const files = fs.readdirSync(descriptionsDir).filter((file) => file.endsWith('.json'));

const insertStatements = [];

files.forEach((file) => {
	const filePath = path.join(descriptionsDir, file);
	const content = fs.readFileSync(filePath, 'utf8');
	const data = JSON.parse(content);

	// Extract slug from filename (remove .json extension)
	const slug = path.basename(file, '.json');

	// Generate UUID for this app
	const appId = uuidv4().toUpperCase();

	// Get category UUID from mapping
	const categoryId = categoryMapping[data.category_link];

	if (!categoryId) {
		console.error(`Unknown category link: ${data.category_link} in file: ${file}`);
		return;
	}

	// Handle aliases - ensure it's always an array and escape quotes
	let aliases = data.aliases || [];
	if (typeof aliases === 'string') {
		aliases = [aliases];
	}

	// Filter out empty strings and escape quotes
	aliases = aliases.filter((alias) => alias && alias.trim() !== '');
	const aliasesJson = JSON.stringify(aliases);

	// Escape single quotes in strings for SQL
	const escapedTitle = data.name.replace(/'/g, "''");
	const escapedColor = data.color;

	// Generate INSERT statement
	const insertStatement = `\t('${appId}', '${slug}', '${escapedTitle}', '${escapedColor}', '${aliasesJson}', '${categoryId}')`;

	insertStatements.push(insertStatement);
});

// Sort by slug for consistent output
insertStatements.sort((a, b) => {
	const slugA = a.split("'")[3]; // Extract slug from INSERT statement
	const slugB = b.split("'")[3];
	return slugA.localeCompare(slugB);
});

// Generate the complete INSERT statement
const completeStatement = `INSERT INTO \`apps\` (\`id\`, \`slug\`, \`title\`, \`color\`, \`aliases\`, \`category_id\`) VALUES
${insertStatements.join(',\n')};`;

console.log(completeStatement);

/**
 * Convert ISO 3166-1 alpha-2 country code to flag emoji
 *
 * Each flag emoji is made of two regional indicator characters
 * These are Unicode symbols starting at U+1F1E6 (for A) through U+1F1FF (for Z).
 *
 * The magic number 0x1F1A5 is just 0x1F1E6 - 65 (where 65 is the char code of 'A').
 * So for any uppercase letter, 0x1F1A5 + charCode lands on the correct regional indicator.
 *
 * @param code ISO 3166-1 alpha-2 country code
 * @returns flag emoji
 */
export const codeToFlag = (code: string) => {
	const MAGIC_NUMBER = 0x1f1a5;
	const codeChars = code.toUpperCase().split('');
	const codePoints = codeChars.map((c) => MAGIC_NUMBER + c.charCodeAt(0));

	return String.fromCodePoint(...codePoints);
};

/**
 * Generate a stable color (hex string) from any input string.
 * - Hashes the input string to an integer
 * - Maps the hash to a hue (0-359)
 * - Uses fixed saturation & lightness for good contrast
 * - Converts HSL to hex and returns a string like `#a1b2c3`
 *
 * This keeps colors consistent between runs and produces visually distinct colors.
 */
export function stringToColor(input: string): string {
	if (!input) return '#777777';

	// Simple string hash (djb2-like)
	let hash = 5381;
	for (let i = 0; i < input.length; i++) {
		hash = (hash * 33) ^ input.charCodeAt(i);
	}

	const hue = Math.abs(hash) % 360; // 0-359
	const saturation = 60; // percent
	const lightness = 50; // percent

	return hslToHex(hue, saturation, lightness);
}

function hslToHex(h: number, s: number, l: number): string {
	// Convert HSL [0-360], [0-100], [0-100] to hex string
	s /= 100;
	l /= 100;

	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0');
	};

	return `#${f(0)}${f(8)}${f(4)}`;
}

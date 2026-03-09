/**
 * Generate a stable color (hex string) from any input string.
 * - Hashes the input string to an integer
 * - Maps the hash to a hue (0-359)
 * - Uses fixed saturation & lightness for good contrast
 * - Converts HSL to hex and returns a string like `#a1b2c3`
 *
 * This keeps colors consistent between runs and produces visually distinct colors.
 */
export function stringToColor(input: string, saturation?: number, lightness?: number): string {
	if (!input) return '#777777';

	// MurmurHash3-inspired: accumulate then apply finalizer for strong avalanche
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = Math.imul(hash ^ input.charCodeAt(i), 0x9e3779b9);
		hash ^= hash >>> 16;
	}
	// MurmurHash3 finalizer
	hash ^= hash >>> 16;
	hash = Math.imul(hash, 0x85ebca6b);
	hash ^= hash >>> 13;
	hash = Math.imul(hash, 0xc2b2ae35);
	hash ^= hash >>> 16;

	const hue = Math.abs(hash) % 360; // 0-359

	// Mix the hash further for saturation and lightness so they also vary independently
	let h2 = hash ^ (hash >>> 11);
	h2 = Math.imul(h2, 0x165667b1);
	h2 ^= h2 >>> 15;

	const resolvedSaturation = saturation ?? (50 + Math.abs(h2) % 40); // 50–90
	const resolvedLightness  = lightness  ?? (35 + Math.abs(h2 ^ (h2 >>> 8)) % 30); // 35–65

	return hslToHex(hue, resolvedSaturation, resolvedLightness);
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

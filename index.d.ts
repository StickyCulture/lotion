declare module 'calipers' {
	export default function calipers(...args: any[]): any
	export function measure(image: string): Promise<any>
}
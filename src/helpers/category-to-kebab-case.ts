export function categoryToKebabCase(str: string): string {
	return str
		.toLocaleLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/\s/g, "-")
}

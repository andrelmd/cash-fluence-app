export const currencyMaskToNumber = (value: string): number => {
	const formatedValue = value.replace(".", "").replace(",", ".")

	return parseFloat(formatedValue)
}

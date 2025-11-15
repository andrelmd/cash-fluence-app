export const currencyMaskToNumber = (value: string): number => {
	const formatedValue = value.replace(",", ".")

	return parseFloat(formatedValue)
}

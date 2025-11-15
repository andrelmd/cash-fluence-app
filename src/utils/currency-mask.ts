export const currencyMask = (value: string | number) => {
	if (typeof value === "number") {
		return value.toFixed(2).replace(".", ",")
	}

	let onlyDigits = value.replace(/\D/g, "")

	const formattedValue = onlyDigits.replace(/(\d)(\d{2})$/, "$1.$2")
	return formattedValue
}

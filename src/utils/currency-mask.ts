export const currencyMask = (value: string | number | undefined | null) => {
	if (!value) return ""

	if (typeof value === "number") {
		return value.toLocaleString("pt-BR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
	}

	const onlyDigits = value.replace(/\D/g, "")

	const numericValue = Number(onlyDigits) / 100

	const currency = numericValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	return currency
}

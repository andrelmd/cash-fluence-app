export const formatCurrency = (amount: number | string | null | undefined): string => {
	if (!amount)
		return Number(0).toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
			maximumFractionDigits: 2,
			minimumFractionDigits: 2,
		})

	return amount.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	})
}

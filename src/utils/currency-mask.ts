export const currencyMask = (value: string) => {
	const formatedValue = value.replace(/\D/g, "").replace(/(\d)(\d{2})$/, "$1,$2");

	return formatedValue;
};

interface IShowIfProps<TValue> {
	value: TValue
	option: any
	children: React.ReactNode
}

export const ShowIf = <TValue,>({ value, children, option }: IShowIfProps<TValue>) => {
	if (option !== value) return null
	return <>{children}</>
}

import React from "react"
import { Spinner } from "./spinner"

interface ICardListProps<TData> extends React.ComponentProps<"div"> {
	data?: TData[] | null
	noContentText: string
	render: (item: TData) => React.ReactNode
}

export const CardList = <TData,>({ noContentText, render, data, className, ...props }: ICardListProps<TData>) => {
	if (!data)
		return (
			<div className="flex flex-1 items-center justify-center">
				<Spinner />
			</div>
		)

	if (!data.length) return <div className="flex flex-1 items-center justify-center">{noContentText}</div>

	return (
		<div className={"flex flex-1 flex-col gap-4 overflow-auto" + className} {...props}>
			{data.map((item) => {
				return render(item)
			})}
		</div>
	)
}

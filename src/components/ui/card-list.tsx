import React from "react"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"
import { Skeleton } from "./skeleton"

interface ICardListProps<TData> extends React.ComponentProps<"div"> {
	data?: TData[] | null
	noContentText: string
	render: (item: TData) => React.ReactNode
	isLoading: boolean
}

export const CardList = <TData,>({
	noContentText,
	render,
	data,
	className,
	isLoading,
	...props
}: ICardListProps<TData>) => {
	const showDelayedSkeleton = useDelayedLoading(isLoading, 500)

	if (showDelayedSkeleton) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				{Array.from({ length: 5 }).map((_, index) => (
					<Skeleton key={index} className="h-36 w-full" />
				))}
			</div>
		)
	}

	if (!data || data.length === 0) {
		return <div className="flex flex-1 items-center justify-center">{noContentText}</div>
	}

	return (
		<div className={"flex flex-1 flex-col gap-4 overflow-auto" + className} {...props}>
			{data.map((item) => {
				return render(item)
			})}
		</div>
	)
}

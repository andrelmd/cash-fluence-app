import React from "react";
import { Spinner } from "./spinner";

interface ICardListProps<TData> {
	content?: TData[] | null;
	noContentText: string;
	render: (item: TData) => React.ReactNode;
}

export const CardList = <TData,>({ noContentText, render, content }: ICardListProps<TData>) => {
	if (!content)
		return (
			<div className="flex flex-1 items-center justify-center">
				<Spinner />
			</div>
		);

	if (!content.length) return <div className="flex flex-1 items-center justify-center">{noContentText}</div>;

	return (
		<div className="flex flex-1 flex-col gap-4 overflow-auto">
			{content.map((item) => {
				return render(item);
			})}
		</div>
	);
};

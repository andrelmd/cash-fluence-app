import { Spinner } from "../../ui/spinner";

interface IContentLayoutProps {
	children: React.ReactNode;
	isLoading?: boolean;
}

export const ContentLayout = ({ children, isLoading = false }: IContentLayoutProps) => {
	if (isLoading) return <Spinner />;
	return <div className="flex flex-1 flex-col p-4">{children}</div>;
};

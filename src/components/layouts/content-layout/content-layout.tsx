import { memo } from "react"
import { Spinner } from "../../ui/spinner"

interface IContentLayoutProps {
	children: React.ReactNode
	isLoading?: boolean
}

export const ContentLayout = memo(({ children, isLoading = false }: IContentLayoutProps) => {
	if (isLoading)
		return (
			<div className="flex flex-1 items-center justify-center">
				<Spinner />
			</div>
		)

	return <>{children}</>
})

import { useState } from "react"
import { Categories } from "../../../categories/pages/categories"
import { PeriodFilterProvider } from "../../../contexts/period-filter-context"
import { Dashboard } from "../../../dashboard/pages/dashboard"
import { getAppPageTitle } from "../../../helpers/get-app-page-title"
import { Plannings } from "../../../plannings/pages/plannings"
import { Recurrences } from "../../../recurrences/pages/recurrences"
import { Transactions } from "../../../transactions/pages/transactions"
import { ThemeProvider } from "../../theme/theme-provider"
import { AppSidebar } from "../../ui/app-sidebar"
import { ModeToggle } from "../../ui/mode-toggle"
import { ShowIf } from "../../ui/show-if"
import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar"
import { Toaster } from "../../ui/sonner"
import { AppPage } from "./constants/app-pages"

export const AppLayout = () => {
	const [selectedPage, setSelectedPage] = useState(AppPage.DASHBOARD)

	const handleOnSelect = (page: AppPage) => {
		setSelectedPage(page)
	}

	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<SidebarProvider>
				<AppSidebar onSelect={handleOnSelect} selectedPage={selectedPage} />
				<div className="flex flex-col p-2 h-dvh w-dvw">
					<div className="flex w-full justify-between items-center p-4">
						<div className="flex w-full gap-2 items-center bg-background">
							<SidebarTrigger />
							{getAppPageTitle(selectedPage)}
						</div>
						<ModeToggle />
					</div>
					<div className="flex flex-1 flex-col overflow-auto p-2">
						<PeriodFilterProvider>
							<ShowIf option={selectedPage} value={AppPage.DASHBOARD}>
								<Dashboard />
							</ShowIf>
							<ShowIf option={selectedPage} value={AppPage.TRANSACTIONS}>
								<Transactions />
							</ShowIf>
							<ShowIf option={selectedPage} value={AppPage.CATEGORIES}>
								<Categories />
							</ShowIf>
							<ShowIf option={selectedPage} value={AppPage.PLANNINGS}>
								<Plannings />
							</ShowIf>
							<ShowIf option={selectedPage} value={AppPage.RECURRENCES}>
								<Recurrences />
							</ShowIf>
						</PeriodFilterProvider>
					</div>
				</div>
				<Toaster position="top-center" />
			</SidebarProvider>
		</ThemeProvider>
	)
}

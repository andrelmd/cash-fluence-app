import { useState } from "react";
import { Categories } from "../../../categories/pages/categories-page";
import { Dashboard } from "../../../dashboard/pages/Dashboard";
import { getAppPageTitle } from "../../../helpers/get-app-page-title";
import { Plannings } from "../../../plannings/pages/Plannings";
import { Transactions } from "../../../transactions/pages/transactions";
import { AppSidebar } from "../../ui/app-sidebar";
import { ShowIf } from "../../ui/show-if";
import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import { AppPage } from "./constants/app-pages";

export const AppLayout = () => {
	const [selectedPage, setSelectedPage] = useState(AppPage.DASHBOARD);

	const handleOnSelect = (page: AppPage) => {
		setSelectedPage(page);
	};

	return (
		<SidebarProvider>
			<AppSidebar onSelect={handleOnSelect} selectedPage={selectedPage} />
			<div className="flex flex-1 flex-col">
				<div className="flex w-full gap-2 items-center p-4">
					<SidebarTrigger />
					{getAppPageTitle(selectedPage)}
				</div>
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
			</div>
		</SidebarProvider>
	);
};

import { ArrowLeftRight, FolderKanban, LayoutDashboard, Target } from "lucide-react"

export enum AppPage {
	DASHBOARD = "dashboard",
	TRANSACTIONS = "transactions",
	CATEGORIES = "categories",
	PLANNINGS = "plannings",
}

export const appPages = [
	{
		icon: <LayoutDashboard />,
		label: "Dashboard",
		value: AppPage.DASHBOARD,
	},
	{
		icon: <ArrowLeftRight />,
		label: "Transações",
		value: AppPage.TRANSACTIONS,
	},
	{
		icon: <FolderKanban />,
		label: "Categorias",
		value: AppPage.CATEGORIES,
	},
	{
		icon: <Target />,
		label: "Planejamentos",
		value: AppPage.PLANNINGS,
	},
]

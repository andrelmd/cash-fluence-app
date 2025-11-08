import { AppPage, appPages } from "../layouts/app-layout/constants/app-pages";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./sidebar";

interface IAppSidebarProps {
	onSelect: (page: AppPage) => void;
	selectedPage: AppPage;
}

export const AppSidebar = ({ onSelect, selectedPage }: IAppSidebarProps) => {
	const handleOnClick = (page: AppPage) => {
		onSelect(page);
	};

	return (
		<Sidebar variant="sidebar">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{appPages.map((item) => (
								<SidebarMenuItem key={item.value}>
									<SidebarMenuButton onClick={() => handleOnClick(item.value)} isActive={selectedPage === item.value}>
										{item.icon}
										{item.label}
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

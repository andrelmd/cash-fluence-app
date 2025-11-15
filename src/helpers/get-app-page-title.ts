import { AppPage, appPages } from "../components/layouts/app-layout/constants/app-pages"

export function getAppPageTitle(page: AppPage) {
	const appPage = appPages.find((it) => it.value === page)
	if (!appPage) return

	return appPage.label
}

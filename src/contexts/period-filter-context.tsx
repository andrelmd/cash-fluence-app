import dayjs, { Dayjs } from "dayjs"
import React, { createContext, useContext, useMemo, useState } from "react"

interface PeriodFilterContextData {
	month: number
	setMonth: (value: number) => void
	year: number
	setYear: (value: number) => void
	date: Dayjs
	startDate: Dayjs
	endDate: Dayjs
}

const PeriodFilterContext = createContext<PeriodFilterContextData | undefined>(undefined)

export const PeriodFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [month, setMonth] = useState(dayjs().month())
	const [year, setYear] = useState(dayjs().year())

	const date = useMemo(() => dayjs().month(month).year(year), [month, year])
	const startDate = useMemo(() => date.startOf("month"), [date])
	const endDate = useMemo(() => date.endOf("month"), [date])

	const value = { month, setMonth, year, setYear, date, startDate, endDate }

	return <PeriodFilterContext.Provider value={value}>{children}</PeriodFilterContext.Provider>
}

export const usePeriodFilterContext = () => {
	const context = useContext(PeriodFilterContext)
	if (context === undefined) {
		throw new Error("usePeriodFilterContext must be used within a PeriodFilterProvider")
	}
	return context
}

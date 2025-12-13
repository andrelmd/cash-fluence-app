import { cva, VariantProps } from "class-variance-authority"
import React from "react"
import { cn } from "../../lib/utils"
import { TColor } from "../../types/color"

interface IColorCircleProps extends React.ComponentProps<"div">, VariantProps<typeof colorCircleVariants> {
	color: TColor
	className?: string
}

const colorVariants: Record<TColor, string> = {
	red: "bg-red-500",
	orange: "bg-orange-500",
	amber: "bg-amber-500",
	yellow: "bg-yellow-500",
	lime: "bg-lime-500",
	green: "bg-green-500",
	emerald: "bg-emerald-500",
	teal: "bg-teal-500",
	cyan: "bg-cyan-500",
	sky: "bg-sky-500",
	blue: "bg-blue-500",
	indigo: "bg-indigo-500",
	violet: "bg-violet-500",
	purple: "bg-purple-500",
	fuchsia: "bg-fuchsia-500",
	pink: "bg-pink-500",
	rose: "bg-rose-500",
}

const colorCircleVariants = cva("rounded-full w-8 h-8", {
	variants: {
		color: colorVariants,
	},
	defaultVariants: {
		color: "red",
	},
})

export const ColorCircle = ({ color, className, ...props }: IColorCircleProps) => {
	return <div data-slot="color-circle" className={cn(colorCircleVariants({ color }), className)} {...props} />
}

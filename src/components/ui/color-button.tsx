import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { TColor } from "../../types/color"
import { Button } from "./button"

interface IColorButtonProps extends React.ComponentProps<"button"> {
	color: TColor
	className?: string
	selected?: boolean
}

const colorHover: Record<TColor, string> = {
	red: "bg-red-500 hover:bg-red-500/30",
	orange: "bg-orange-500 hover:bg-orange-500/30",
	amber: "bg-amber-500 hover:bg-amber-500/30",
	yellow: "bg-yellow-500 hover:bg-yellow-500/30",
	lime: "bg-lime-500 hover:bg-lime-500/30",
	green: "bg-green-500 hover:bg-green-500/30",
	emerald: "bg-emerald-500 hover:bg-emerald-500/30",
	teal: "bg-teal-500 hover:bg-teal-500/30",
	cyan: "bg-cyan-500 hover:bg-cyan-500/30",
	sky: "bg-sky-500 hover:bg-sky-500/30",
	blue: "bg-blue-500 hover:bg-blue-500/30",
	indigo: "bg-indigo-500 hover:bg-indigo-500/30",
	violet: "bg-violet-500 hover:bg-violet-500/30",
	purple: "bg-purple-500 hover:bg-purple-500/30",
	fuchsia: "bg-fuchsia-500 hover:bg-fuchsia-500/30",
	pink: "bg-pink-500 hover:bg-pink-500/30",
	rose: "bg-rose-500 hover:bg-rose-500/30",
}

const colorButtonVariants = cva("rounded-full w-8 h-8", {
	variants: {
		color: colorHover,
		selected: {
			true: "ring-2 ring-offset-0 ring-primary",
			false: "",
		},
	},
	defaultVariants: {
		color: "red",
	},
})

export const ColorButton = ({ color, className, selected = false, ...props }: IColorButtonProps) => {
	return (
		<Button
			key={color}
			variant={"default"}
			className={cn(colorButtonVariants({ color, selected }), className)}
			{...props}
		/>
	)
}

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
	red: "bg-red hover:bg-red/50",
	orange: "bg-orange hover:bg-orange/50",
	amber: "bg-amber hover:bg-amber/50",
	yellow: "bg-yellow hover:bg-yellow/50",
	lime: "bg-lime hover:bg-lime/50",
	green: "bg-green hover:bg-green/50",
	emerald: "bg-emerald hover:bg-emerald/50",
	teal: "bg-teal hover:bg-teal/50",
	cyan: "bg-cyan hover:bg-cyan/50",
	sky: "bg-sky hover:bg-sky/50",
	blue: "bg-blue hover:bg-blue/50",
	indigo: "bg-indigo hover:bg-indigo/50",
	violet: "bg-violet hover:bg-violet/50",
	purple: "bg-purple hover:bg-purple/50",
	fuchsia: "bg-fuchsia hover:bg-fuchsia/50",
	pink: "bg-pink hover:bg-pink/50",
	rose: "bg-rose hover:bg-rose/50",
	primary: "bg-primary hover:bg-primary/50",
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
		color: "primary",
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

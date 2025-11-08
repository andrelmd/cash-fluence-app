import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../../lib/utils";
import { TColor } from "../../types/color";

interface IColorCircleProps extends React.ComponentProps<"div">, VariantProps<typeof colorCircleVariants> {
	color: TColor;
	className?: string;
}

const colorVariants: Record<TColor, string> = {
	red: "bg-red",
	orange: "bg-orange",
	amber: "bg-amber",
	yellow: "bg-yellow",
	lime: "bg-lime",
	green: "bg-green",
	emerald: "bg-emerald",
	teal: "bg-teal",
	cyan: "bg-cyan",
	sky: "bg-sky",
	blue: "bg-blue",
	indigo: "bg-indigo",
	violet: "bg-violet",
	purple: "bg-purple",
	fuchsia: "bg-fuchsia",
	pink: "bg-pink",
	rose: "bg-rose",
	slate: "bg-slate",
	gray: "bg-gray",
	zinc: "bg-zinc",
	neutral: "bg-neutral",
	stone: "bg-stone",
	primary: "bg-primary",
	secondary: "bg-secondary",
	background: "bg-background",
};

const colorCircleVariants = cva("rounded-full w-8 h-8", {
	variants: {
		color: colorVariants,
	},
	defaultVariants: {
		color: "primary",
	},
});

export const ColorCircle = ({ color, className, ...props }: IColorCircleProps) => {
	return <div data-slot="color-circle" className={cn(colorCircleVariants({ color }), className)} {...props} />;
};

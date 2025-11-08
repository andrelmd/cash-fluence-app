import { Controller, useFormContext } from "react-hook-form";
import { colors } from "../../constants/colors";
import { ColorButton } from "./color-button";
import { Label } from "./label";

interface IColorSelectProps {
	name: string;
	label: string;
}

export const ColorSelect = ({ label, name }: IColorSelectProps) => {
	const { control } = useFormContext();
	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<div className="flex flex-col flex-wrap gap-2">
					<Label htmlFor={field.name}>{label}</Label>
					<div id={field.name} className="flex flex-wrap gap-2">
						{colors.map((color) => (
							<ColorButton
								key={color}
								type="button"
								color={color}
								selected={field.value === color}
								onClick={() => field.onChange(color)}
							/>
						))}
					</div>
				</div>
			)}
		/>
	);
};

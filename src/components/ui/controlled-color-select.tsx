import { Controller, useFormContext } from "react-hook-form"
import { colors } from "../../constants/colors"
import { camelCaseToKebabCase } from "../../utils/camel-case-to-kebab-case"
import { ColorButton } from "./color-button"
import { Field, FieldError, FieldLabel } from "./field"

interface IColorSelectProps {
	name: string
	label: string
}

export const ControlledColorSelect = ({ label, name }: IColorSelectProps) => {
	const { control } = useFormContext()

	const fieldId = `color-select-${camelCaseToKebabCase(name)}`

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<div className="flex flex-col flex-wrap gap-2">
						<FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
						<div id={fieldId} className="flex flex-wrap gap-3">
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
					{fieldState.error && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	)
}

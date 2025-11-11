import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ISelectOptions } from "../../interfaces/select-options";
import { camelCaseToKebabCase } from "../../utils/camel-case-to-kebab-case";
import { Field, FieldContent, FieldError, FieldLabel } from "./field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface IControlledSelect extends React.ComponentProps<typeof Select> {
	name: string;
	label: string;
	placeholder?: string;
	options: ISelectOptions[];
}

export const ControlledSelect = ({ label, name, options, placeholder, ...props }: IControlledSelect) => {
	const { control } = useFormContext();

	const selectId = `select-${camelCaseToKebabCase(name)}`;

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldContent>
						<FieldLabel htmlFor={selectId}>{label}</FieldLabel>
					</FieldContent>
					<Select name={field.name} value={field.value || null} onValueChange={field.onChange} {...props}>
						<SelectTrigger id={selectId}>
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Select>
				</Field>
			)}
		/>
	);
};

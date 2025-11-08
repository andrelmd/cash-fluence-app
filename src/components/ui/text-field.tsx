import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./field";
import { Input } from "./input";

interface TextFieldProps extends React.ComponentProps<"input"> {
	label: string;
	name: string;
}

export const TextField = ({ label, name, ...props }: TextFieldProps) => {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<Input {...field} id={field.name} aria-invalid={fieldState.invalid} {...props} />
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
};

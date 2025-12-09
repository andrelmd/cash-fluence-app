import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "./field"
import { Input } from "./input"

interface TextFieldProps extends React.ComponentProps<"input"> {
	label: string
	name: string
	mask?: (value: string) => string
}

export const TextField = ({ label, name, mask, ...props }: TextFieldProps) => {
	const { control } = useFormContext()

	const handleOnChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		callback: (event: React.ChangeEvent<HTMLInputElement>) => void
	) => {
		if (mask) {
			const value = mask(event.target.value)
			event.target.value = value
		}

		return callback(event)
	}

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<Input
						{...field}
						value={field.value || null}
						onChange={(e) => handleOnChange(e, field.onChange)}
						id={field.name}
						aria-invalid={fieldState.invalid}
						{...props}
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	)
}

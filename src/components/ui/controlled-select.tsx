import * as SelectPrimitive from "@radix-ui/react-select"
import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { ISelectFieldOptions } from "../../interfaces/select-options"
import { Field } from "./field"
import { SelectField } from "./select-field"

interface IControlledSelect extends React.ComponentProps<typeof Field> {
	name: string
	label: string
	placeholder?: string
	options: ISelectFieldOptions[]
	slotProps?: {
		select: React.ComponentProps<typeof SelectPrimitive.Root>
	}
}

export const ControlledSelect = ({ label, name, options, placeholder, ...props }: IControlledSelect) => {
	const { control } = useFormContext()

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<SelectField
					{...props}
					{...fieldState}
					label={label}
					options={options}
					placeholder={placeholder}
					slotProps={{
						select: {
							...field,
							onValueChange: field.onChange,
						},
					}}
				/>
			)}
		/>
	)
}

import * as SelectPrimitive from "@radix-ui/react-select"
import { FieldError as FieldFormError } from "react-hook-form"
import { ISelectFieldOptions } from "../../interfaces/select-field-options"
import { camelCaseToKebabCase } from "../../utils/camel-case-to-kebab-case"
import { Field, FieldError, FieldLabel } from "./field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface ISelectFieldProps extends React.ComponentProps<typeof Field> {
	label: string
	options: ISelectFieldOptions[]
	name?: string
	placeholder?: string
	invalid?: boolean
	error?: FieldFormError
	slotProps: {
		select: React.ComponentProps<typeof SelectPrimitive.Root>
	}
}

export const SelectField = ({
	label,
	options,
	error,
	invalid,
	name,
	placeholder,
	slotProps,
	...props
}: ISelectFieldProps) => {
	const { select } = slotProps
	const selectId = `select-${camelCaseToKebabCase(name ?? label)}`
	return (
		<Field data-invalid={invalid} {...props}>
			<FieldLabel htmlFor={selectId}>{label}</FieldLabel>
			<Select {...select}>
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
				{invalid && <FieldError errors={[error]} />}
			</Select>
		</Field>
	)
}

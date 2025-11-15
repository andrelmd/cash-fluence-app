import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Field, FieldContent, FieldError } from "./field"
import { Label } from "./label"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface IControlledDatePickerProps {
	name: string
	label: string
}

export const ControlledDatePicker = ({ name, label }: IControlledDatePickerProps) => {
	const { control } = useFormContext()
	const [isOpen, setIsOpen] = useState(false)

	const handleOnSelect = (event: any, callback: (event: any) => void) => {
		callback(event)
		setIsOpen(false)
	}

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldContent>
						<Label htmlFor={field.name}>{label}</Label>
					</FieldContent>
					<Popover open={isOpen} onOpenChange={setIsOpen}>
						<PopoverTrigger asChild>
							<Button
								id={field.name}
								variant="outline"
								data-empty={!field.value}
								className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
							>
								<CalendarIcon />
								{field.value ? format(field.value, "dd/MM/yyyy") : <span>Escolha uma data</span>}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={field.value || null}
								onSelect={(e) => handleOnSelect(e, field.onChange)}
							/>
						</PopoverContent>
					</Popover>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	)
}

import { useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useFetchCategories } from "../../hooks/use-fetch-categories"
import { Field } from "./field"
import { Label } from "./label"
import { MultiSelect } from "./multi-select"

interface IMultiSelectCategories extends React.ComponentProps<typeof Field> {
	name: string
	label: string
}

export const MultiSelectCategories = ({ label, name, ...props }: IMultiSelectCategories) => {
	const { control } = useFormContext()
	const { data: categories } = useFetchCategories()

	const categoryOptions = useMemo(() => {
		if (!categories) return []
		return categories.map((category) => ({
			label: category.name,
			value: String(category.id),
		}))
	}, [categories])

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<div className="flex flex-col gap-2" {...props}>
					<Label>{label}</Label>
					<MultiSelect
						options={categoryOptions}
						onValueChange={(values) => field.onChange(values.map((v) => Number(v)))}
						defaultValue={field.value?.map(String) || []}
						placeholder="Selecione as categorias..."
						maxCount={5}
					/>
					{fieldState.error && <span className="text-sm text-destructive">{fieldState.error.message}</span>}
				</div>
			)}
		/>
	)
}

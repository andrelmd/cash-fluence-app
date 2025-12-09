import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../../components/ui/button"
import { ControlledSelect } from "../../components/ui/controlled-select"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog"
import { TextField } from "../../components/ui/text-field"
import { useFetchCategories } from "../../hooks/use-fetch-categories"
import { useUpdatePlanning } from "../../hooks/use-update-planning"
import { ISelectFieldOptions } from "../../interfaces/select-field-options"
import { currencyMask } from "../../utils/currency-mask"
import { currencyMaskToNumber } from "../../utils/currency-mask-to-number"
import { Planning } from "../entities/planning"

interface IPlanningFormProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	planning: Planning | null
	onClose?: () => void
}

const formSchema = z.object({
	id: z.number().optional(),
	amount: z
		.string("Digite um valor válido")
		.transform(currencyMaskToNumber)
		.pipe(z.number("Digite um valor válido").min(1, "Valor inválido")),
	categoryId: z.coerce.number("Selecione uma categoria válida").min(0, "Categoria inválida"),
	month: z.coerce.number("Selecione um mês válido").min(0, "Mês inválido").max(11, "Mês inválido"),
	year: z.coerce.number("Selecione um ano válido").min(dayjs().year(), "Ano inválido"),
})

type SchemaInput = z.input<typeof formSchema>
type SchemaOutput = z.output<typeof formSchema>

export const CategoryForm = ({ planning: planning, onOpenChange, open, onClose }: IPlanningFormProps) => {
	const methods = useForm<SchemaInput, any, SchemaOutput>({
		resolver: zodResolver(formSchema),
	})

	const { data: categories } = useFetchCategories()
	const { mutateAsync: updateFn } = useUpdatePlanning()

	const categoryOptions = useMemo(() => {
		if (!categories) return []
		return categories.map((category) => ({
			label: category.name,
			value: String(category.id),
		}))
	}, [categories])

	const MonthOptions: ISelectFieldOptions[] = useMemo(
		() =>
			Array.from({ length: 12 }, (_, index) => ({
				label: dayjs().month(index).format("MMMM"),
				value: String(index),
			})),
		[]
	)

	const handleOnSubmit = async (data: SchemaOutput) => {
		await updateFn(data)
		methods.reset()
		onOpenChange(false)
	}

	const handleOnClose = () => {
		methods.reset()
		if (onClose) onClose()
	}

	useEffect(() => {
		const defaultValues = {
			id: planning?.id,
			amount: planning?.amount.toFixed(2),
			categoryId: planning?.categoryId.toString(),
			month: planning?.month.toString() || dayjs().month().toString(),
			year: planning?.year.toString() || dayjs().year().toString(),
		}

		methods.reset(defaultValues)
	}, [planning, methods])

	return (
		<FormProvider {...methods}>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{planning ? "Editar planejamento" : "Novo planejamento"}</DialogTitle>
						<DialogDescription>Crie um novo planejamento para seus gastos.</DialogDescription>
					</DialogHeader>
					<form
						id={"category-form"}
						onSubmit={methods.handleSubmit(handleOnSubmit)}
						className="flex flex-col gap-4"
					>
						<div className="flex flex-col gap-4">
							<TextField label="Valor planejado (R$)" name="amount" mask={currencyMask} />
							<ControlledSelect
								label="Categoria"
								name="categoryId"
								placeholder="Categoria"
								options={categoryOptions}
							/>
							<div className="flex gap-8">
								<ControlledSelect label="Mês" name="month" options={MonthOptions} />
								<TextField label="Ano" name="year" mask={(value) => value.replace(/\D/g, "")} />
							</div>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="ghost" type="button" onClick={handleOnClose}>
									Fechar
								</Button>
							</DialogClose>
							<Button type="submit">Salvar</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</FormProvider>
	)
}

import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"
import { Button } from "../../components/ui/button"
import { ControlledDatePicker } from "../../components/ui/controlled-date-picker"
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
import { useUpdateRecurrence } from "../../hooks/use-update-recurrences"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { currencyMask } from "../../utils/currency-mask"
import { currencyMaskToNumber } from "../../utils/currency-mask-to-number"
import { Recurrence } from "../entities/recurrence"

const formSchema = z.object({
	id: z.number().nullable(),
	type: z.coerce.number("Selecione um tipo de recorrência").min(0, "Tipo de recorrência inválido"),
	amount: z
		.string("Digite um valor válido")
		.transform(currencyMaskToNumber)
		.pipe(z.number("Digite um valor válido").min(1, "Valor inválido")),
	description: z.string("Digite uma descrição válida"),
	categoryId: z.coerce.number("Selecione uma categoria válida").min(1, "Categoria inválida"),
	createDate: z.date("Digite uma data válida").transform((value: Date) => dayjs(value)),
	dueDate: z.date("Digite uma data válida").transform((value: Date) => dayjs(value)),
})

type SchemaInput = z.input<typeof formSchema>
type SchemaOutput = z.output<typeof formSchema>

interface IRecurrenceFormProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	recurrence: Recurrence | null
	onClose?: () => void
}

export const RecurrenceForm = ({ onOpenChange, open, recurrence, onClose }: IRecurrenceFormProps) => {
	const { mutateAsync: updateFn } = useUpdateRecurrence()
	const { data: categories } = useFetchCategories()
	const methods = useForm<SchemaInput, any, SchemaOutput>({
		resolver: zodResolver(formSchema),
	})

	const categoryOptions = useMemo(() => {
		if (!categories) return []
		return categories.map((category) => ({
			label: category.name,
			value: String(category.id),
		}))
	}, [categories])

	const resetForm = () => {
		methods.reset()
	}

	const handleOnsubmit = async (data: SchemaOutput) => {
		updateFn(new Recurrence({ ...data, nextExecutionDate: dayjs().add(-1, "day") }))
		handleOnClose()
	}

	const handleOnClose = () => {
		resetForm()
		if (onClose) onClose()
	}

	const handleOnOpenChange = (open: boolean) => {
		if (!open) {
			resetForm()
		}
		onOpenChange(open)
	}

	useEffect(() => {
		const defaultValues = {
			id: recurrence?.id || null,
			type: recurrence?.type?.toString() ?? null,
			amount: recurrence?.amount.toFixed(2) || "",
			description: recurrence?.description || "",
			categoryId: recurrence?.categoryId?.toString() || null,
			createDate: recurrence?.createDate?.toDate() || new Date(),
			dueDate: recurrence?.dueDate?.toDate() || new Date(),
		}
		methods.reset(defaultValues)
	}, [recurrence, methods])

	return (
		<FormProvider {...methods}>
			<Dialog open={open} onOpenChange={handleOnOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{recurrence ? "Editar recorrência" : "Nova recorrência"}</DialogTitle>
						<DialogDescription>Crie uma nova recorrência ou edite uma já existente.</DialogDescription>
					</DialogHeader>
					<form onSubmit={methods.handleSubmit(handleOnsubmit)}>
						<div className="flex flex-1 flex-col gap-4 overflow-auto">
							<ControlledSelect
								label="Tipo"
								name="type"
								placeholder="Tipo de recorrência"
								options={[
									{
										label: "Entrada",
										value: String(TransactionType.INCOME),
									},
									{
										label: "Saída",
										value: String(TransactionType.EXPENSE),
									},
								]}
							/>
							<TextField label="Valor (R$)" name="amount" mask={currencyMask} type="number" />
							<TextField label="Descrição" name="description" />
							<ControlledSelect
								label="Categoria"
								name="categoryId"
								placeholder="Categoria"
								options={categoryOptions}
							/>
							<ControlledDatePicker name="dueDate" label="Data da recorrência" />

							<DialogFooter>
								<DialogClose asChild>
									<Button variant="ghost" type="button" onClick={handleOnClose}>
										Fechar
									</Button>
								</DialogClose>
								<Button type="submit">Salvar</Button>
							</DialogFooter>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</FormProvider>
	)
}

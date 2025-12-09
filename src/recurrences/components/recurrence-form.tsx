import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"
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
import { LabelledSwitch } from "../../components/ui/labelled-switch"
import { ShowIf } from "../../components/ui/show-if"
import { TextField } from "../../components/ui/text-field"
import { useFetchCategories } from "../../hooks/use-fetch-categories"
import { useUpdateRecurrence } from "../../hooks/use-update-recurrences"
import { useUpdateTransaction } from "../../hooks/use-update-transaction"
import { ISelectFieldOptions } from "../../interfaces/select-field-options"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { Transaction } from "../../transactions/entities/transaction"
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
	month: z.coerce.number("Selecione um mês válido").min(0, "Mês inválido"),
	day: z.coerce.number("Selecione um dia válido").min(1, "Dia inválido"),
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
	const { mutateAsync: createTransactionFn } = useUpdateTransaction()
	const { data: categories } = useFetchCategories()
	const [createTransaction, setCreateTransaction] = useState(false)

	const methods = useForm<SchemaInput, any, SchemaOutput>({
		resolver: zodResolver(formSchema),
	})

	const watchMonth = methods.watch("month")

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

	const dayOptions: ISelectFieldOptions[] = useMemo(
		() =>
			Array.from({ length: dayjs().set("month", Number(watchMonth)).daysInMonth() }, (_, index) => ({
				label: String(index + 1),
				value: String(index + 1),
			})),
		[watchMonth]
	)

	const resetForm = () => {
		methods.reset()
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

	const handleOnsubmit = async (data: SchemaOutput) => {
		const dueDate = dayjs().set("date", data.day).set("month", data.month).startOf("day")

		if (createTransaction) {
			await createTransactionFn({
				transaction: new Transaction({
					...data,
					dueDate,
				}),
				saveInInstallments: false,
			})
		}

		await updateFn(new Recurrence({ ...data, dueDate }))
		handleOnClose()
	}

	useEffect(() => {
		const defaultValues = {
			id: recurrence?.id || null,
			type: recurrence?.type?.toString() ?? null,
			amount: recurrence?.amount.toFixed(2) || "",
			description: recurrence?.description || "",
			categoryId: recurrence?.categoryId?.toString() || null,
			createDate: recurrence?.createDate?.toDate() || new Date(),
			month: recurrence?.dueDate?.month().toString() || dayjs().month().toString(),
			day: recurrence?.dueDate?.date().toString() || dayjs().date().toString(),
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
							<TextField label="Valor (R$)" name="amount" mask={currencyMask} />
							<TextField label="Descrição" name="description" />
							<ControlledSelect
								label="Categoria"
								name="categoryId"
								placeholder="Categoria"
								options={categoryOptions}
							/>
							<div className="flex w-fit gap-4">
								<ControlledSelect label="Dia" name="day" placeholder="Dia" options={dayOptions} />
								<ControlledSelect label="Mês" name="month" placeholder="Mês" options={MonthOptions} />
							</div>
							<ShowIf option={recurrence} value={null}>
								<LabelledSwitch
									label="Gerar transação agora"
									checked={createTransaction}
									onCheckedChange={setCreateTransaction}
								/>
							</ShowIf>
							<DialogFooter className="pt-2">
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

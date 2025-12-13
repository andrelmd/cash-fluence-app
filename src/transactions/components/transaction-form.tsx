import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"
import { Button } from "../../components/ui/button"
import { Collapsible, CollapsibleContent } from "../../components/ui/collapsible"
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
import { Label } from "../../components/ui/label"
import { SelectField } from "../../components/ui/select-field"
import { ShowIf } from "../../components/ui/show-if"
import { Switch } from "../../components/ui/switch"
import { TextField } from "../../components/ui/text-field"
import { useFetchCategories } from "../../hooks/use-fetch-categories"
import { useUpdateTransaction } from "../../hooks/use-update-transaction"
import { currencyMask } from "../../utils/currency-mask"
import { currencyMaskToNumber } from "../../utils/currency-mask-to-number"
import { TransactionType } from "../constants/transaction-type"
import { Transaction } from "../entities/transaction"

const formSchema = z.object({
	id: z.number().nullable(),
	type: z.coerce.number("Selecione um tipo de transação").min(0, "Tipo de transação inválido"),
	amount: z
		.string("Digite um valor válido")
		.transform(currencyMaskToNumber)
		.pipe(z.number("Digite um valor válido").min(1, "Valor inválido")),
	description: z.string("Digite uma descrição válida"),
	categoryId: z.coerce.number("Selecione uma categoria válida").min(1, "Categoria inválida"),
	createDate: z.date("Digite uma data válida").transform((value: Date) => dayjs(value)),
	dueDate: z.date("Digite uma data válida").transform((value: Date) => dayjs(value)),
	paymentDate: z
		.date("Digite uma data válida")
		.transform((value: Date) => dayjs(value))
		.nullable(),
	installments: z.coerce.number("Digite uma quantidade válida").min(1).nullable(),
	currentInstallment: z.coerce.number("Digite uma quantidade válida").min(1).nullable(),
})

type SchemaInput = z.input<typeof formSchema>
type SchemaOutput = z.output<typeof formSchema>

interface ITransactionFormProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	transaction: Transaction | null
	onClose?: () => void
}

export const TransactionForm = ({ onOpenChange, open, transaction, onClose }: ITransactionFormProps) => {
	const [isInstallment, setIsInstallment] = useState(false)
	const [isPaid, setIsPaid] = useState(false)
	const { mutateAsync: updateFn } = useUpdateTransaction()
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

	const handleOnIsInstallmentChange = (open: boolean) => {
		setIsInstallment(open)
	}

	const resetForm = () => {
		methods.reset()
		setIsInstallment(false)
		setIsPaid(false)
	}

	const handleOnsubmit = async (data: SchemaOutput) => {
		await updateFn({
			transaction: new Transaction(data),
			saveInInstallments: isInstallment,
		})
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
		if (!isInstallment) {
			methods.setValue("installments", null)
			methods.setValue("currentInstallment", null)
		}
	}, [isInstallment])

	useEffect(() => {
		if (!isPaid) {
			methods.setValue("paymentDate", null)
		}
		methods.setValue("paymentDate", new Date())
	}, [isPaid])

	useEffect(() => {
		const hasInstallments = !!transaction?.installments && transaction.installments > 0
		setIsInstallment(hasInstallments)

		const defaultValues = {
			id: transaction?.id || null,
			type: transaction?.type?.toString() ?? null,
			amount: currencyMask(transaction?.amount),
			description: transaction?.description || "",
			categoryId: transaction?.categoryId?.toString() || null,
			createDate: transaction?.createDate?.toDate() || new Date(),
			dueDate: transaction?.dueDate?.toDate() || new Date(),
			paymentDate: transaction?.paymentDate?.toDate() || null,
			installments: transaction?.installments?.toString() || null,
			currentInstallment: transaction?.currentInstallment?.toString() || null,
		}
		methods.reset(defaultValues)
	}, [transaction, methods])

	return (
		<FormProvider {...methods}>
			<Dialog open={open} onOpenChange={handleOnOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{transaction ? "Editar transação" : "Nova transação"}</DialogTitle>
						<DialogDescription>Crie uma nova entrada ou saída para suas transações.</DialogDescription>
					</DialogHeader>
					<form onSubmit={methods.handleSubmit(handleOnsubmit)}>
						<div className="flex flex-1 flex-col gap-4 overflow-auto">
							<ControlledSelect
								label="Tipo"
								name="type"
								placeholder="Tipo de transação"
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
							<TextField label="Descrição" name="description" />
							<ControlledSelect
								label="Categoria"
								name="categoryId"
								placeholder="Categoria"
								options={categoryOptions}
							/>
							<ControlledDatePicker name="createDate" label="Data da transação" />
							<ControlledDatePicker name="dueDate" label="Data de vencimento" />
							<ShowIf option={transaction} value={null}>
								<SelectField
									label="Forma de pagamento"
									options={[
										{ label: "A vista", value: "false" },
										{ label: "Parcelado", value: "true" },
									]}
									slotProps={{
										select: {
											value: isInstallment.toString(),
											onValueChange: (value) => setIsInstallment(value === "true" ? true : false),
										},
									}}
								/>
								<Collapsible open={isInstallment} onOpenChange={handleOnIsInstallmentChange}>
									<CollapsibleContent className="flex flex-col gap-4">
										<TextField label={"Valor da parcela"} name="amount" mask={currencyMask} />
										<div className="flex gap-8">
											<TextField label="Quantidade de parcelas" name="installments" />
											<TextField label="Parcela atual" name="currentInstallment" />
										</div>
									</CollapsibleContent>
								</Collapsible>
							</ShowIf>
							<Collapsible open={!isInstallment} onOpenChange={handleOnIsInstallmentChange}>
								<CollapsibleContent>
									<TextField label={"Valor da transação"} name="amount" mask={currencyMask} />
								</CollapsibleContent>
							</Collapsible>
							<div className="flex items-center justify-between">
								<Label htmlFor="is-paid">Transação Paga</Label>
								<Switch id="is-paid" checked={isPaid} onCheckedChange={setIsPaid} />
							</div>
							<Collapsible open={isPaid} onOpenChange={setIsPaid}>
								<CollapsibleContent>
									<ControlledDatePicker name="paymentDate" label="Data do pagamento" />
								</CollapsibleContent>
							</Collapsible>

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

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../../components/ui/button"
import { ControlledColorSelect } from "../../components/ui/controlled-color-select"
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
import { useUpdateCategory } from "../../hooks/use-update-category"
import { currencyMask } from "../../utils/currency-mask"
import { currencyMaskToNumber } from "../../utils/currency-mask-to-number"
import { Category } from "../entities/Category"

interface ICategoryFormProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	category: Category | null
	onClose?: () => void
}

const formSchema = z.object({
	id: z.number().optional(),
	color: z.string("Selecione uma cor válida").transform((value) => value as Category["color"]),
	monthlyLimit: z
		.string()
		.optional()
		.transform((value) => (value ? currencyMaskToNumber(value) : undefined))
		.pipe(z.number("Valor precisa ser um número").min(1, "Valor inválido").optional()),
	name: z.string("Nome é obrigatório").min(1, "Nome inválido"),
})

type SchemaInput = z.input<typeof formSchema>
type SchemaOutput = z.output<typeof formSchema>

export const CategoryForm = ({ category, onOpenChange, open, onClose }: ICategoryFormProps) => {
	const { mutateAsync: updateFn } = useUpdateCategory()

	const methods = useForm<SchemaInput, any, SchemaOutput>({
		resolver: zodResolver(formSchema),
	})

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
			id: category?.id,
			name: category?.name || "",
			color: category?.color || "",
			monthlyLimit: category?.monthlyLimit?.toFixed(2) || "",
		}
		methods.reset(defaultValues)
	}, [category, methods])

	return (
		<FormProvider {...methods}>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{category ? "Editar categoria" : "Nova categoria"}</DialogTitle>
						<DialogDescription>Crie uma nova categoria para suas transações.</DialogDescription>
					</DialogHeader>
					<form id={"category-form"} onSubmit={methods.handleSubmit(handleOnSubmit)}>
						<div className="flex flex-col gap-4">
							<TextField label="Nome" name="name" />
							<TextField
								label="Limite mensal (R$)"
								name="monthlyLimit"
								mask={currencyMask}
								type="number"
							/>
							<ControlledColorSelect name="color" label="Cor" />
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

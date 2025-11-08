import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { ColorSelect } from "../../components/ui/color-select";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../components/ui/dialog";
import { TextField } from "../../components/ui/text-field";
import { useCategories } from "../../hooks/use-categories";
import { Category } from "../entities/Category";

interface IDialogCategoryFormProps {
	category?: Category;
	children?: React.ReactNode;
	onFinish?: () => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

const formSchema = z.object({
	color: z.string(),
	id: z.number().optional(),
	monthlyLimit: z.coerce.number<number>().min(0),
	name: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const CategoryFormContent = ({ category, onFinish }: Omit<IDialogCategoryFormProps, "children">) => {
	const { updateFn } = useCategories();

	const methods = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	useEffect(() => {
		methods.reset(category);
	}, [category, methods]);

	const handleOnSubmit = async (data: FormData) => {
		await updateFn(data);
		onFinish?.();
	};

	return (
		<FormProvider {...methods}>
			<form id={"category-form"} onSubmit={methods.handleSubmit(handleOnSubmit)}>
				<DialogHeader>
					<DialogTitle>{category ? "Editar categoria" : "Nova categoria"}</DialogTitle>
					<DialogDescription>Crie uma nova categoria para suas transações.</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<TextField label="Nome" name="name" />
					<TextField label="Limite mensal (R$)" name="monthlyLimit" />
					<ColorSelect name="color" label="Cor" />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost">Fechar</Button>
					</DialogClose>
					<Button type="submit">Salvar</Button>
				</DialogFooter>
			</form>
		</FormProvider>
	);
};

export const CategoryForm = ({ category, children, open, onOpenChange }: IDialogCategoryFormProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent>
				<CategoryFormContent category={category} onFinish={() => onOpenChange?.(false)} />
			</DialogContent>
		</Dialog>
	);
};

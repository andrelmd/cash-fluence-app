import { ArrowDownCircleIcon, ArrowUpCircleIcon, Edit, Trash } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ColorCircle } from "../../components/ui/color-circle";
import { Label } from "../../components/ui/label";
import { useCategories } from "../../hooks/use-categories";
import { useTransactions } from "../../hooks/use-transactions";
import { TransactionType } from "../constants/transaction-type";
import { Transaction } from "../entities/transaction";

interface ITransactionCardProps {
	transaction: Transaction;
	onEdit?: (transaction: Transaction) => void;
}

export const TransactionCard = ({ transaction, onEdit }: ITransactionCardProps) => {
	const { amount, categoryId, createDate, currentInstallment, description, installments, type } = transaction;
	const transactionIcon = type === TransactionType.EXPENSE ? <ArrowDownCircleIcon /> : <ArrowUpCircleIcon />;

	const { deleteMutation } = useTransactions();
	const { mutateAsync: deleteFn } = deleteMutation;
	const { data } = useCategories();

	const category = useMemo(() => {
		if (!data) return null;

		return data.find((category) => category.id === categoryId);
	}, [data, categoryId]);

	const handleOnDelete = async () => {
		if (!transaction.id) return;
		await deleteFn(transaction);
	};

	const handleOnEdit = () => {
		if (onEdit) onEdit(transaction);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center gap-2">
						<div data-type={type} className="rounded-full data-[type=0]:bg-green data-[type=1]:bg-red p-2">
							{transactionIcon}
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								{description}
								{installments && installments > 0 && (
									<Badge variant={"outline"}>
										{currentInstallment}/{installments}x
									</Badge>
								)}
							</div>
							<Label>{createDate.format("DD/MM/YYYY")}</Label>
						</div>
					</div>
				</CardTitle>
				<CardAction>
					<Button variant="ghost" onClick={handleOnEdit}>
						<Edit />
					</Button>
					<Button variant="ghost" onClick={handleOnDelete}>
						<Trash />
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="flex justify-between">
					<div className="flex gap-2 items-center">
						{category && <ColorCircle className="w-4 h-4" color={category.color} />}
						<p>{category?.name}</p>
					</div>
					<div data-type={type} className="flex items-center gap-2 data-[type=0]:text-green-400 data-[type=1]:text-red-400">
						{type === TransactionType.EXPENSE ? "- " : "+ "}
						{amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

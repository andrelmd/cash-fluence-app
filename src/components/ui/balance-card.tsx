import { TransactionType } from "../../transactions/constants/transaction-type";
import { Card, CardContent, CardDescription, CardHeader } from "./card";

interface ITransactionSummaryCardProps {
	type?: TransactionType | null;
	amount: number;
}

export const BalanceCard = ({ amount, type }: ITransactionSummaryCardProps) => {
	return (
		<Card>
			<CardHeader></CardHeader>
			<CardDescription></CardDescription>
			<CardContent></CardContent>
		</Card>
	);
};

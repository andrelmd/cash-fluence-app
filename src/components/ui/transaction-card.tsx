import { Transaction } from "../../transactions/entities/transaction";

interface ITransactionCardProps {
	transaction: Transaction;
	onClick?: () => void;
}

export const TransactionCard = ({ transaction, onClick }: ITransactionCardProps) => {
	return <></>;
};

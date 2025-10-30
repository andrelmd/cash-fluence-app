import { Tabs, TabsProps } from "antd";
import { useMemo } from "react";
import { transactionToTable } from "../helpers/transaction-to-table";
import { TransactionType } from "./constants/transaction-type";
import { useTransaction } from "./hooks/useTransactions";
import { SaveTransactionForm } from "./save-transaction-form";
import { IData, TransactionTable } from "./transaction-list";

export const TransactionPage = () => {
	const {
		query: { data: incomeTransactions, isLoading: isLoadingIncome },
	} = useTransaction({
		type: TransactionType.INCOME,
	});
	const {
		query: { data: expenseTransactions, isLoading: isLoadingExpense },
	} = useTransaction({
		type: TransactionType.EXPENSE,
	});
	const {
		query: { data: allTransactions, isLoading: isLoadingAll },
		deleteMutation: { mutateAsync: deleteTransaction },
	} = useTransaction({});

	const allDataSource = useMemo(() => {
		if (!allTransactions) return [];
		return allTransactions.map(transactionToTable);
	}, [allTransactions]);

	const incomeDataSource = useMemo(() => {
		if (!incomeTransactions) return [];
		return incomeTransactions.map(transactionToTable);
	}, [incomeTransactions]);

	const expenseDataSource = useMemo(() => {
		if (!expenseTransactions) return [];
		return expenseTransactions.map(transactionToTable);
	}, [expenseTransactions]);

	const handleOnDelete = (record: IData) => {
		if (!deleteTransaction) return;
		if (!record.key) return;
		deleteTransaction(Number(record.key));
	};

	const items: TabsProps["items"] = [
		{
			key: "1",
			label: "Todas",
			children: <TransactionTable data={allDataSource} loading={isLoadingAll} onDelete={handleOnDelete} />,
		},
		{
			key: "2",
			label: "Entradas",
			children: (
				<>
					<SaveTransactionForm />
					<TransactionTable data={incomeDataSource} loading={isLoadingIncome} onDelete={handleOnDelete} />
				</>
			),
		},
		{
			key: "3",
			label: "Saídas",
			children: <TransactionTable data={expenseDataSource} loading={isLoadingExpense} onDelete={handleOnDelete} />,
		},
	];

	return (
		<div style={{ width: "100%", height: "100%" }}>
			<h3>Transações</h3>
			<Tabs defaultActiveKey="1" items={items} />
		</div>
	);
};

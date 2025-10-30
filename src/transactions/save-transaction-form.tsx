import { Button, DatePicker, Form, Input, Select } from "antd";
import { Transaction } from "./classes/transaction";
import { TransactionType } from "./constants/transaction-type";
import { useTransaction } from "./hooks/useTransactions";

export const SaveTransactionForm = () => {
	const [form] = Form.useForm();
	const { mutation } = useTransaction();

	const onFinish = async (values: any) => {
		console.log("Success:", values);
		const newTransaction = new Transaction({
			amount: Number(values.amount),
			date: values.date,
			description: values.description,
			category: values.category,
			type: TransactionType.INCOME,
		});

		await mutation.mutateAsync(newTransaction);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
			<Form.Item name={"date"} label="Data da transação">
				<DatePicker size="large" placeholder="Data" style={{ width: "100%" }} lang="pt_BR" />
			</Form.Item>
			<Form.Item name={"amount"} label="Valor">
				<Input size="large" placeholder="Valor" />
			</Form.Item>
			<Form.Item name={"description"} label="Descrição">
				<Input size="large" placeholder="Descrição" />
			</Form.Item>
			<Form.Item name={"category"} label="Categoria">
				<Select
					size="large"
					placeholder="Categoria"
					style={{ width: "100%" }}
					options={[
						{ value: "salary", label: "Salário" },
						{ value: "investment", label: "Investimento" },
						{ value: "other", label: "Outros" },
					]}
				/>
			</Form.Item>
			<Form.Item>
				<Button size="large" htmlType="submit">
					Salvar
				</Button>
			</Form.Item>
		</Form>
	);
};

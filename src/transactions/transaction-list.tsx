import { DeleteOutlined } from "@ant-design/icons";
import { Button, Table, TableProps } from "antd";
import { Dayjs } from "dayjs";

export interface IData {
	key: string;
	date: Dayjs;
	amount: number;
	description: string;
	category: string;
}

interface ITransactionTableProps extends TableProps<IData> {
	data: IData[];
	onDelete: (record: IData) => void;
}

export const TransactionTable = ({ data, onDelete, ...rest }: ITransactionTableProps) => {
	const columns: TableProps<IData>["columns"] = [
		{
			title: "Data",
			dataIndex: "date",
			key: "date",
			render: (date: Dayjs) => date.toDate().toLocaleDateString(),
			sorter: (a: IData, b: IData) => a.date.toDate().getTime() - b.date.toDate().getTime(),
		},
		{
			title: "Valor",
			dataIndex: "amount",
			key: "amount",
			render: (amount: number) => {
				return amount.toLocaleString("pt-BR", {
					style: "currency",
					currency: "BRL",
				});
			},
			sorter: (a: IData, b: IData) => a.amount - b.amount,
		},
		{
			title: "Descrição",
			dataIndex: "description",
			key: "description",
			sorter: (a: IData, b: IData) => a.description.localeCompare(b.description),
		},
		{
			title: "Categoria",
			dataIndex: "category",
			key: "category",
			sorter: (a: IData, b: IData) => a.category.localeCompare(b.category),
		},
		{
			title: "Ações",
			key: "action",
			render: (record) => (
				<Button color="volcano" onClick={() => onDelete(record)}>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	return (
		<>
			<Table<IData>
				dataSource={data}
				columns={columns}
				bordered
				size="large"
				style={{ width: "100%", height: "100%" }}
				pagination={false}
				{...rest}
			/>
		</>
	);
};

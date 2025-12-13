import { useCallback } from "react"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../../components/ui/dialog"
import { useDeleteTransaction } from "../../hooks/use-delete-transaction"
import { useFetchTransactions } from "../../hooks/use-fetch-transactions"
import { Transaction } from "../entities/transaction"

interface ITrnasactionDeleteInstallmentsDialogProps {
	transaction: Transaction
	open: boolean
	onOpenChange: (open: boolean) => void
}

export const TrnasactionDeleteInstallmentsDialog = ({
	transaction,
	open,
	onOpenChange,
}: ITrnasactionDeleteInstallmentsDialogProps) => {
	const { installmentCode } = transaction

	if (!installmentCode) return null

	const { mutateAsync: deleteFn } = useDeleteTransaction()
	const { data } = useFetchTransactions({ installmentCode })

	const handleDeleteAll = useCallback(async () => {
		if (!data) return
		await Promise.all(data.map((transaction) => deleteFn(transaction)))
		onOpenChange(false)
	}, [data])

	const handleOnDelete = async () => {
		await deleteFn(transaction)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>Deseja remover todas as parcelas da transação {transaction.description}?</DialogHeader>
				<DialogFooter>
					<div className="flex justify-between w-full">
						<Button onClick={handleOnDelete}>Não, apenas está</Button>
						<Button onClick={handleDeleteAll} variant={"destructive"}>
							Excluir todas as parcelas
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

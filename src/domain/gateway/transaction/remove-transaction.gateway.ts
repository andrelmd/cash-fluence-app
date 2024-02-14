export interface RemoveTransactionGateway {
  removeTransaction: (id: number) => Promise<boolean>;
}

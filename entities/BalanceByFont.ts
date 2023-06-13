export interface BalanceByFontInterface {
  id: number;
  balance_font_id: number;
  balance: number;
  created_at: string;
}
export class BalanceByFont {
  id: number;
  balanceFontId: number;
  balance: number;
  createdAt: Date;

  constructor(balanceByFontInterface: BalanceByFontInterface) {
    this.id = balanceByFontInterface.id;
    this.balanceFontId = balanceByFontInterface.balance_font_id;
    this.balance = balanceByFontInterface.balance;
    this.createdAt = new Date(balanceByFontInterface.created_at);
  }
}

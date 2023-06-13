export interface BalanceFontInterface {
  id: number;
  name: string;
}
export class BalanceFont {
  id: number;
  name: string;

  constructor(balanceFontInterface: BalanceFontInterface) {
    this.id = balanceFontInterface.id;
    this.name = balanceFontInterface.name;
  }
}

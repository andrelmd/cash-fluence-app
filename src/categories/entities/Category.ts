import { TColor } from "../../types/color";

export class Category {
	id?: number;
	name: string;
	color: TColor;
	monthlyLimit?: number;

	constructor({ id, name, color, monthlyLimit }: { id?: number; name: string; color: TColor; monthlyLimit?: number }) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.monthlyLimit = monthlyLimit;
	}
}

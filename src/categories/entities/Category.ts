export class Category {
	id?: number;
	name: string;
	color: string;
	monthlyLimit?: number;

	constructor({ id, name, color, monthlyLimit }: { id?: number; name: string; color: string; monthlyLimit?: number }) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.monthlyLimit = monthlyLimit;
	}
}

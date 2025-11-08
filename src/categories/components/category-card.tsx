import { Edit, Trash } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ColorCircle } from "../../components/ui/color-circle";
import { TColor } from "../../types/color";
import { Category } from "../entities/Category";

interface ICategoryCardProps {
	category: Category;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
}

export const CategoryCard = ({ category, onDelete, onEdit }: ICategoryCardProps) => {
	const { color, name, monthlyLimit, id } = category;

	const monthlyLimitContent = useMemo(() => {
		if (monthlyLimit <= 0) return <Badge>Sem limite definido</Badge>;
		return <Badge className="rounded-sm">{monthlyLimit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Badge>;
	}, [monthlyLimit]);

	const handleOnEdit = () => {
		if (!id) return;
		onEdit?.(id);
	};

	const handleOnDelete = () => {
		if (!id) return;
		onDelete?.(id);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ColorCircle color={color as TColor} />
					{name}
				</CardTitle>
				<CardAction>
					<Button variant="ghost" onClick={handleOnEdit}>
						<Edit />
					</Button>
					<Button variant="ghost" onClick={handleOnDelete}>
						<Trash />
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div>
					<p>Limite mensal</p>
					{monthlyLimitContent}
				</div>
			</CardContent>
		</Card>
	);
};

import { Label } from "./label"
import { Switch } from "./switch"

interface ILabelledSwitchProps {
	label: string
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}

export const LabelledSwitch = ({ label, checked, onCheckedChange }: ILabelledSwitchProps) => {
	return (
		<div className="flex items-center justify-between">
			<Label htmlFor={`${label}-switch`}>{label}</Label>
			<Switch id={`${label}-switch`} checked={checked} onCheckedChange={onCheckedChange} />
		</div>
	)
}

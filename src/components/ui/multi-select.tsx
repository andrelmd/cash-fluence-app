import { cva, type VariantProps } from "class-variance-authority"
import { CheckIcon, ChevronDown, XCircle, XIcon } from "lucide-react"
import * as React from "react"
import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { Button } from "./button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Separator } from "./separator"

const multiSelectVariants = cva("m-1 transition-all duration-300 ease-in-out", {
	variants: {
		variant: {
			default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
			secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
			destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
			inverted: "inverted",
		},
	},
	defaultVariants: {
		variant: "default",
	},
})

interface MultiSelectOption {
	label: string
	value: string
	icon?: React.ComponentType<{ className?: string }>
	disabled?: boolean
}

interface MultiSelectGroup {
	heading: string
	options: MultiSelectOption[]
}

interface MultiSelectProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "defaultValue">,
		VariantProps<typeof multiSelectVariants> {
	options: MultiSelectOption[] | MultiSelectGroup[]
	onValueChange: (value: string[]) => void
	defaultValue?: string[]
	placeholder?: string
	maxCount?: number
	modalPopover?: boolean
	asChild?: boolean
	className?: string
	hideSelectAll?: boolean
	searchable?: boolean
	emptyIndicator?: React.ReactNode
	disabled?: boolean
}

export interface MultiSelectRef {
	reset: () => void
	getSelectedValues: () => string[]
	setSelectedValues: (values: string[]) => void
	clear: () => void
	focus: () => void
}

export const MultiSelect = React.forwardRef<MultiSelectRef, MultiSelectProps>(
	(
		{
			options,
			onValueChange,
			variant,
			defaultValue = [],
			placeholder = "Select options",
			maxCount = 3,
			modalPopover = false,
			className,
			hideSelectAll = false,
			searchable = true,
			emptyIndicator,
			disabled = false,
			...props
		},
		ref
	) => {
		const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue)
		const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
		const [searchValue, setSearchValue] = React.useState("")

		const buttonRef = React.useRef<HTMLButtonElement>(null)

		const isGroupedOptions = React.useCallback(
			(opts: MultiSelectOption[] | MultiSelectGroup[]): opts is MultiSelectGroup[] => {
				return opts.length > 0 && "heading" in opts[0]
			},
			[]
		)

		const getAllOptions = React.useCallback((): MultiSelectOption[] => {
			if (options.length === 0) return []
			if (isGroupedOptions(options)) {
				return options.flatMap((group) => group.options)
			}
			return options
		}, [options, isGroupedOptions])

		const getOptionByValue = React.useCallback(
			(value: string): MultiSelectOption | undefined => {
				return getAllOptions().find((option) => option.value === value)
			},
			[getAllOptions]
		)

		const filteredOptions = React.useMemo(() => {
			if (!searchable || !searchValue) return options
			if (options.length === 0) return []
			if (isGroupedOptions(options)) {
				return options
					.map((group) => ({
						...group,
						options: group.options.filter(
							(option) =>
								option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
								option.value.toLowerCase().includes(searchValue.toLowerCase())
						),
					}))
					.filter((group) => group.options.length > 0)
			}
			return options.filter(
				(option) =>
					option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
					option.value.toLowerCase().includes(searchValue.toLowerCase())
			)
		}, [options, searchValue, searchable, isGroupedOptions])

		const toggleOption = (optionValue: string) => {
			if (disabled) return
			const option = getOptionByValue(optionValue)
			if (option?.disabled) return
			const newSelectedValues = selectedValues.includes(optionValue)
				? selectedValues.filter((value) => value !== optionValue)
				: [...selectedValues, optionValue]
			setSelectedValues(newSelectedValues)
			onValueChange(newSelectedValues)
		}

		const handleClear = () => {
			if (disabled) return
			setSelectedValues([])
			onValueChange([])
		}

		const handleTogglePopover = () => {
			if (disabled) return
			setIsPopoverOpen((prev) => !prev)
		}

		const toggleAll = () => {
			if (disabled) return
			const allOptions = getAllOptions().filter((option) => !option.disabled)
			if (selectedValues.length === allOptions.length) {
				handleClear()
			} else {
				const allValues = allOptions.map((option) => option.value)
				setSelectedValues(allValues)
				onValueChange(allValues)
			}
		}

		const resetToDefault = React.useCallback(() => {
			setSelectedValues(defaultValue)
			setIsPopoverOpen(false)
			setSearchValue("")
			onValueChange(defaultValue)
		}, [defaultValue, onValueChange])

		React.useImperativeHandle(
			ref,
			() => ({
				reset: resetToDefault,
				getSelectedValues: () => selectedValues,
				setSelectedValues: (values: string[]) => {
					setSelectedValues(values)
					onValueChange(values)
				},
				clear: () => {
					setSelectedValues([])
					onValueChange([])
				},
				focus: () => {
					buttonRef.current?.focus()
				},
			}),
			[resetToDefault, selectedValues, onValueChange]
		)

		React.useEffect(() => {
			if (!isPopoverOpen) {
				setSearchValue("")
			}
		}, [isPopoverOpen])

		React.useEffect(() => {
			setSelectedValues(defaultValue)
		}, [defaultValue])

		return (
			<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
				<PopoverTrigger asChild>
					<Button
						ref={buttonRef}
						{...props}
						onClick={handleTogglePopover}
						disabled={disabled}
						variant="outline"
						className={cn(
							"flex p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto w-full",
							disabled && "opacity-50 cursor-not-allowed",
							className
						)}
					>
						{selectedValues.length > 0 ? (
							<div className="flex justify-between items-center w-full">
								<div className="flex items-center gap-1 flex-wrap">
									{selectedValues.slice(0, maxCount).map((value) => {
										const option = getOptionByValue(value)
										const IconComponent = option?.icon
										if (!option) return null
										return (
											<Badge key={value} className={cn(multiSelectVariants({ variant }))}>
												{IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
												<span>{option.label}</span>
												<div
													role="button"
													tabIndex={0}
													onClick={(event) => {
														event.stopPropagation()
														toggleOption(value)
													}}
													onKeyDown={(event) => {
														if (event.key === "Enter" || event.key === " ") {
															event.preventDefault()
															event.stopPropagation()
															toggleOption(value)
														}
													}}
													className="ml-2 h-4 w-4 cursor-pointer hover:bg-white/20 rounded-sm p-0.5 -m-0.5"
												>
													<XCircle className="h-3 w-3" />
												</div>
											</Badge>
										)
									})}
									{selectedValues.length > maxCount && (
										<Badge
											className={cn(
												"bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
												multiSelectVariants({ variant })
											)}
										>
											{`+ ${selectedValues.length - maxCount} mais`}
										</Badge>
									)}
								</div>
								<div className="flex items-center justify-between">
									<div
										role="button"
										tabIndex={0}
										onClick={(event) => {
											event.stopPropagation()
											handleClear()
										}}
										onKeyDown={(event) => {
											if (event.key === "Enter" || event.key === " ") {
												event.preventDefault()
												event.stopPropagation()
												handleClear()
											}
										}}
										className="flex items-center justify-center h-4 w-4 mx-2 cursor-pointer text-muted-foreground hover:text-foreground"
									>
										<XIcon className="h-4 w-4" />
									</div>
									<Separator orientation="vertical" className="flex min-h-6 h-full" />
									<ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
								</div>
							</div>
						) : (
							<div className="flex items-center justify-between w-full mx-auto">
								<span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
								<ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
							</div>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto p-0 min-w-[300px]"
					align="start"
					onEscapeKeyDown={() => setIsPopoverOpen(false)}
				>
					<Command>
						{searchable && (
							<CommandInput placeholder="Buscar..." value={searchValue} onValueChange={setSearchValue} />
						)}
						<CommandList className="max-h-[40vh] overflow-y-auto">
							<CommandEmpty>{emptyIndicator || "Nenhum resultado encontrado."}</CommandEmpty>
							{!hideSelectAll && !searchValue && (
								<CommandGroup>
									<CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
												selectedValues.length ===
													getAllOptions().filter((opt) => !opt.disabled).length
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible"
											)}
										>
											<CheckIcon className="h-4 w-4" />
										</div>
										<span>Selecionar Todos</span>
									</CommandItem>
								</CommandGroup>
							)}
							{isGroupedOptions(filteredOptions) ? (
								filteredOptions.map((group) => (
									<CommandGroup key={group.heading} heading={group.heading}>
										{group.options.map((option) => {
											const isSelected = selectedValues.includes(option.value)
											return (
												<CommandItem
													key={option.value}
													onSelect={() => toggleOption(option.value)}
													className={cn(
														"cursor-pointer",
														option.disabled && "opacity-50 cursor-not-allowed"
													)}
													disabled={option.disabled}
												>
													<div
														className={cn(
															"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
															isSelected
																? "bg-primary text-primary-foreground"
																: "opacity-50 [&_svg]:invisible"
														)}
													>
														<CheckIcon className="h-4 w-4" />
													</div>
													{option.icon && (
														<option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
													)}
													<span>{option.label}</span>
												</CommandItem>
											)
										})}
									</CommandGroup>
								))
							) : (
								<CommandGroup>
									{filteredOptions.map((option) => {
										const isSelected = selectedValues.includes(option.value)
										return (
											<CommandItem
												key={option.value}
												onSelect={() => toggleOption(option.value)}
												className={cn(
													"cursor-pointer",
													option.disabled && "opacity-50 cursor-not-allowed"
												)}
												disabled={option.disabled}
											>
												<div
													className={cn(
														"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
														isSelected
															? "bg-primary text-primary-foreground"
															: "opacity-50 [&_svg]:invisible"
													)}
												>
													<CheckIcon className="h-4 w-4" />
												</div>
												{option.icon && (
													<option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
												)}
												<span>{option.label}</span>
											</CommandItem>
										)
									})}
								</CommandGroup>
							)}
							<CommandSeparator />
							<CommandGroup>
								<div className="flex items-center justify-between">
									{selectedValues.length > 0 && (
										<>
											<CommandItem
												onSelect={handleClear}
												className="flex-1 justify-center cursor-pointer"
											>
												Limpar
											</CommandItem>
											<Separator orientation="vertical" className="flex min-h-6 h-full" />
										</>
									)}
									<CommandItem
										onSelect={() => setIsPopoverOpen(false)}
										className="flex-1 justify-center cursor-pointer max-w-full"
									>
										Fechar
									</CommandItem>
								</div>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		)
	}
)

MultiSelect.displayName = "MultiSelect"
export type { MultiSelectGroup, MultiSelectOption, MultiSelectProps }

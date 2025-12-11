import { toast } from "sonner"
import { useUpdater } from "../contexts/updater-context"
import { formatBytes } from "../utils/format-bytes"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Progress } from "./ui/progress"

export const UpdateNotification = () => {
	const { updateAvailable, installUpdate, updateMetadata, totalSize, downloading, progress } = useUpdater()

	if (!updateAvailable) {
		return null
	}

	const percentage = totalSize > 0 ? (progress / totalSize) * 100 : 0

	return (
		<div className="flex flex-col gap-2 pb-4 px-4">
			<div className="flex items-center gap-2">
				<Label>
					Nova versão disponível {updateMetadata?.version && `(v${updateMetadata.version})`}
					{totalSize > 0 && ` - ${formatBytes(totalSize)}`}
				</Label>
				<Button
					variant={"outline"}
					disabled={downloading}
					onClick={() =>
						toast.promise(() => installUpdate(), {
							loading: "Instalando...",
							success: "Atualização instalada com sucesso",
							error: "Erro ao instalar atualização",
						})
					}
				>
					Instalar
				</Button>
			</div>
			{downloading && <Progress value={percentage} className="h-2" />}
		</div>
	)
}

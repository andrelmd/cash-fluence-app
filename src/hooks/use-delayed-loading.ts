import { useEffect, useRef, useState } from "react"

export const useDelayedLoading = (isLoading: boolean, delayMs: number = 500): boolean => {
	const [showDelayedSkeleton, setShowDelayedSkeleton] = useState(isLoading)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}

		if (isLoading) {
			setShowDelayedSkeleton(true)
		} else {
			timeoutRef.current = setTimeout(() => setShowDelayedSkeleton(false), delayMs)
		}

		return () => clearTimeout(timeoutRef.current as NodeJS.Timeout)
	}, [isLoading, delayMs])

	return showDelayedSkeleton
}

import {ChangeEvent, MouseEvent} from "react"
import {ICalendarContext} from "./context"

export type OClick = MouseEvent<HTMLElement> | ChangeEvent<HTMLSelectElement>

export type OClassName = {
	className?: string
}
export type OCalendarContextProp = {
	date: ICalendarContext
}

export type OButtonProps = {
	handler: (e: OClick) => void
}

import {ChangeEvent, MouseEvent, MouseEventHandler, ReactNode} from "react"
import {ICalendarContext} from "./context"

export type ODate = {
	date: Date
}
export type OActionsType = "setDay" | "setMonth" | "setYear"
export type OActionsPayload = "incr" | "decr" | number
export type OActions = {
	type: OActionsType
	payload: OActionsPayload
}

type ODayCellWithData = {
	n: number
	isToday: boolean
	dayIndex: number
	dayName: string
}
type ODayCellBlank = {isBlank: true}

export type ODayCellModel = ODayCellWithData | ODayCellBlank

export type OLabel = {
	label?: string
}
export type OIcon = {
	icon?: ReactNode
}
export type ODescription = {
	description?: string
}
export type OPath = {
	path: string
}
export type OClick = MouseEvent<HTMLElement> | ChangeEvent<HTMLSelectElement>

export type OChildren = {
	children: ReactNode
}

export type OSlug = {
	slug?: string
}

export type OOptions = {
	options: (OSlug & OLabel)[]
}
export type OSortingOrder = {
	order: "asc" | "desc" | null
}
export type OColumnPath = {
	path:
		| "firstName"
		| "lastName"
		| "startingDate"
		| "department"
		| "dateOfBirth"
		| "street"
		| "city"
		| "zipCode"
}
export type ODepartmentOptions = "Sales" | "Marketing" | "Engineering" | "Human Resources" | "Legal"
export type OEmployee = {
	firstName: string
	lastName: string
	startingDate: Date
	department: ODepartmentOptions
	dateOfBirth: Date
	street: string
	city: string
	zipCode: string
}
export type OInputSearchValue = {
	value: string | null
}
export type OInputDateProps = {
	label: string
	onSetDate: MouseEventHandler<HTMLDivElement>
	value: string
}
export type OClassName = {
	className?: string
}
export type OCalendarContextProp = {
	date: ICalendarContext
}

export type OButtonProps = {
	handler: (e: OClick) => void
}

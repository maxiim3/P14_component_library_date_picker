//region context
import {createContext, useCallback, useReducer} from "react"
import {OClick} from "./types"

/**
 * @description Context for the DatePicker component
 * @see CalendarContext
 * @interface ICalendarContext
 */
export interface ICalendarContext {
	isVisible: boolean
	today: Date
	displayedDate: Date
	selectedDate: Date | undefined
}

/**
 * @description Initial context for the DatePicker component
 * @type {{today: Date, displayedDate: Date, isVisible: boolean, selectedDate: undefined}}
 * @see CalendarContext
 */
export const initialCalendarContext: ICalendarContext = {
	isVisible: false,
	displayedDate: new Date(),
	today: new Date(),
	selectedDate: undefined,
}

/**
 * @description Actions for the Calendar Context Reducer
 * @see reduceCalendar
 * @see CalendarContext
 */
export type OReducerActions =
	| {type: "calendarVisibility"; payload: boolean}
	| {type: "selectedDate"; payload: Date}
	| {type: "displayedDate"; payload: Date}

/**
 * @description Reducer for the Calendar Context
 * @see CalendarContext
 * @param {ICalendarContext} prevState
 * @function
 * @param {OReducerActions} action
 */
function reduceCalendar(prevState: ICalendarContext, action: OReducerActions) {
	switch (action.type) {
		case "calendarVisibility":
			return {...prevState, isVisible: action.payload}
		case "selectedDate":
			return {...prevState, selectedDate: action.payload}
		case "displayedDate":
			return {...prevState, displayedDate: action.payload}

		default:
			return prevState
	}
}

/**
 * @description Factory for the Calendar Context
 * @see CalendarContext
 * @see useCalendarApi
 * @return {{calendar: never, setDisplayedDate: (e: OClick, date: Date) => void, toggleVisibility: (e: OClick) => void, setSelectedDate: (e: OClick, date: Date) => void}}
 */
export function initialCalendarContextFactory() {
	const [calendar, dispatchCalendar] = useReducer(reduceCalendar, initialCalendarContext)

	/**
	 * @description Toggles the visibility of the calendar to show / hide the portal
	 * @type {(e: OClick) => void}
	 */
	const toggleVisibility = useCallback((e: OClick) => {
		e.preventDefault()
		dispatchCalendar({type: "calendarVisibility", payload: !calendar.isVisible})
	}, [])

	/**
	 * @description Sets the date selected by the use in the calendar
	 * @default today's date
	 * @type {(e: OClick, date: Date) => void}
	 */
	const setSelectedDate = useCallback((e: OClick, date: Date) => {
		e.preventDefault()
		dispatchCalendar({type: "selectedDate", payload: date})
	}, [])

	/**
	 * @description Sets the displayed date in the calendar
	 * @type {(e: OClick, date: Date) => void}
	 */
	const setDisplayedDate = useCallback((e: OClick, date: Date) => {
		e.preventDefault()
		dispatchCalendar({type: "displayedDate", payload: date})
	}, [])

	return {
		calendar,
		toggleVisibility,
		setSelectedDate,
		setDisplayedDate,
	}
}

/**
 * @description forwards the return type of the initialCalendarContextFactory function
 * @see initialCalendarContextFactory
 */
export type OCalendarApi = ReturnType<typeof initialCalendarContextFactory>

/**
 * @description Calendar Context
 * @context
 * @see ICalendarContext
 * @see initialCalendarContext
 * @see initialCalendarContextFactory
 */
export const CalendarContext = createContext<OCalendarApi | undefined>(undefined)

//endregion
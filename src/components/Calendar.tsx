import React, {useContext, useEffect, useMemo, useRef} from "react"
import {CalendarContext, ICalendarContext, OCalendarApi} from "../misc/context"
import {OClick} from "../misc/types"
import BasedButton from "./atoms/based.button.styled"
import {BackdropBg, Container, Footer, Header, Main, Navigation, Window} from "./atoms/atomesUI.styled"
import {
	BackToTodayButton,
	CloseButton,
	HeaderRow,
	RowsOfDays,
	SelectedDate,
	ValidateButton,
	VisibleDate,
} from "./organisms/organismsUI.styled"

/**
 * @description Interface for the particule of a day in the calendar
 * @see dayCellFactory
 * @interface ICalendarDayCell
 */
interface ICalendarDayCell {
	isBlank: boolean
	isToday?: boolean
	isSelected?: boolean
	dayOfWeek?: number | undefined
	dayIndex?: number | undefined
	fullDate?: Date | undefined
}

/**+
 * @description Factory Function | Create a day cell for the calendar
 * @see ICalendarDayCell
 * @factory
 * @funtion
 * @param {ICalendarDayCell} props
 * @return {{dayIndex: number | undefined, dayOfWeek: number | undefined, fullDate: Date | undefined, isToday: boolean, isSelected: boolean, isBlank: boolean}}
 */
const dayCellFactory = (props: ICalendarDayCell) => {
	const isBlank = props.isBlank || false
	const dayIndex = props?.dayIndex || undefined
	const dayOfWeek = props?.dayOfWeek ?? undefined
	const fullDate = props?.fullDate || undefined
	const isToday = props?.isToday || false

	return {
		dayIndex,
		dayOfWeek,
		isBlank,
		fullDate,
		isToday,
	}
}
export type ODayCellFactory = ReturnType<typeof dayCellFactory>

/**
 * @description Helper function that return the number of days in a month
 * @function
 * @see Calendar
 * @utils
 * @helper
 * @param {number} month
 * @param {number} year
 * @return {number}
 */
function daysInMonth(month: number, year: number) {
	const nextMonth = month + 1
	const lastDayOfPreviousMonth = 0
	return new Date(year, nextMonth, lastDayOfPreviousMonth).getDate()
}

/**
 * @description Helper function that returns the corresponding month name
 * @function
 * @utils
 * @helper
 * @see Calendar
 * @param {string} month
 * @return {number}
 */
export function convertMonthToString(month: number) {
	switch (month) {
		case 0:
			return "Jan"
		case 1:
			return "Feb"
		case 2:
			return "Mar"
		case 3:
			return "Apr"
		case 4:
			return "May"
		case 5:
			return "Jun"
		case 6:
			return "Jul"
		case 7:
			return "Aug"
		case 8:
			return "Sep"
		case 9:
			return "Oct"
		case 10:
			return "Nov"
		case 11:
			return "Dec"
		default:
			return "Jan"
	}
}

/**
 * @description Helper function that returns the corresponding day of the week
 * @function
 * @utils
 * @helper
 * @param {number} day
 * @return {string}
 */
function convertWeekDayToString(day: number) {
	switch (day) {
		case 0:
			return "Sun"
		case 1:
			return "Mon"
		case 2:
			return "Tue"
		case 3:
			return "Wed"
		case 4:
			return "Thu"
		case 5:
			return "Fri"
		case 6:
			return "Sat"
		default:
			return "Mon"
	}
}

/**
 * @description Helper function for finding by which day of the week the month starts
 * @utils
 * @helper
 * @see Calendar
 * @param {number} month
 * @param {number} year
 * @return {number}
 */
function firstDayOfTheWeek(month: number, year: number) {
	const firstDayOfMonth = 1
	return new Date(year, month, firstDayOfMonth).getDay()
}

/**
 * @description Helper function for calculating the padding days to add to the grid between Monday and the first day of the month
 * @utils
 * @helper
 * @function
 * @see Calendar
 * @see mapDays
 * @param {number} firstWeekDay
 * @return {number}
 */
function calculateDayPadding(firstWeekDay: number) {
	return firstWeekDay === 0 ? 7 : firstWeekDay - 1
}

/**
 * @description Helper function for mapping an array of days for the given month that is visible to the user
 * @param {Date} date
 * @return {ICalendarDayCell[]}
 * @see Calendar
 * @see dayCellFactory
 * @see ICalendarDayCell
 * @function
 * @utils
 */
function mapDays(date: Date) {
	const todayDate = new Date().getDate()
	const todayMonth = new Date().getMonth()
	const todayYear = new Date().getFullYear()

	const visibleMonth = date.getMonth()
	const visibleYear = date.getFullYear()
	const numberOfDays = daysInMonth(visibleMonth, visibleYear)
	const firstWeekDay = firstDayOfTheWeek(visibleMonth, visibleYear)
	const dayPadding = calculateDayPadding(firstWeekDay)

	const days: ODayCellFactory[] = []
	for (let i = 1; i <= dayPadding + numberOfDays; i++) {
		if (i <= dayPadding) {
			const blankDay: ICalendarDayCell = {isBlank: true}
			days.push(dayCellFactory(blankDay))
		} else {
			const d = i - dayPadding
			const date = new Date(visibleYear, visibleMonth, d)
			const newDay: ICalendarDayCell = {
				isBlank: false,
				dayIndex: date.getDate(),
				dayOfWeek: date.getDay(),
				fullDate: date,
				isToday:
					date.getDate() === todayDate &&
					date.getMonth() === todayMonth &&
					date.getFullYear() === todayYear,
				isSelected: false,
			}
			days.push(dayCellFactory(newDay))
		}
	}

	return days
}

/**
 * @description Initialize the days mapping for the current month (today's month) to the user
 * @function
 * @utils
 * @see Calendar
 * @see mapDays
 * @see ICalendarDayCell
 * @param {Date} today
 * @return {any[]}
 */
function initDaysMapping(today: Date) {
	return mapDays(today)
}

export function convertDateToLocalString(date?: Date) {
	return date
		? date?.toLocaleDateString(undefined, {
				day: "2-digit",
				month: "short",
				year: "2-digit",
		  })
		: ""
}

/**
 * @description React hook for managing the calendar context state. Forwards the calendar context to the children components
 * @function
 * @hook
 * @see Calendar
 * @see CalendarContext
 * @see ICalendarContext
 * @return {{calendar: never, setDisplayedDate: (e: OClick, date: Date) => void, toggleVisibility: (e: OClick) => void, setSelectedDate: (e: OClick, date: Date) => void}}
 */
export function useCalendarApi() {
	const context: OCalendarApi = useContext(CalendarContext)!
	if (!context.calendar) throw new Error("CalendarContext is not defined")
	return {...context}
}

export type CalendarProps = {
	onClose: () => void
}
/**
 * @description Main Calendar component that renders the calendar
 * @component
 * @main
 * @see CalendarContext
 * @see useCalendarApi
 * @see HeaderRow
 * @see RowsOfDays
 * @see DatePicker
 * @return {JSX.Element}
 * @constructor
 */
export const Calendar = ({onClose}: CalendarProps) => {
	const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>

	const {calendar, setDisplayedDate} = useCalendarApi()
	const {displayedDate} = calendar
	const mayDays = useMemo(() => initDaysMapping(displayedDate), [displayedDate])

	function previousMonth(e: OClick) {
		let getPreviousMonth = displayedDate.getMonth() - 1
		let withUpdatedMonth = displayedDate.setMonth(getPreviousMonth)
		const updated = new Date(withUpdatedMonth)
		setDisplayedDate(e, updated)
	}

	function nextMonth(e: OClick) {
		let getNextMonth = displayedDate.getMonth() + 1
		let withUpdatedMonth = displayedDate.setMonth(getNextMonth)
		const updated = new Date(withUpdatedMonth)
		setDisplayedDate(e, updated)
	}

	function goBackToToday(e: OClick) {
		const today = new Date()
		setDisplayedDate(e, today)
	}

	function closeOnEscape(e: KeyboardEvent) {
		if (e.key === "Escape") return onClose()
	}

	useEffect(() => {
		document.addEventListener("keydown", closeOnEscape)

		return () => {
			document.removeEventListener("keydown", closeOnEscape)
		}
	}, [])

	return (
		<Window tabIndex={-1}>
			<Container
				ref={containerRef}
				role={"dialog"}
				aria-label={"Calendar Modal"}>
				<Header>
					<Navigation aria-label={"calendar navigation"}>
						<BasedButton
							isNavButton
							aria-label={"previous month button"}
							aria-describedby={"Select to go to the previous month"}
							onClick={previousMonth}>
							{"<"}
						</BasedButton>
						<VisibleDate />
						<BasedButton
							isNavButton
							aria-label={"next month button"}
							aria-describedby={"Select to go to the next month"}
							onClick={nextMonth}>
							{">"}
						</BasedButton>
					</Navigation>
					<CloseButton handler={onClose} />
				</Header>
				<Main>
					<HeaderRow />
					<RowsOfDays days={mayDays} />
				</Main>
				<Footer>
					<SelectedDate date={calendar} />
					<BackToTodayButton
						aria-label={"Go back to today's date"}
						handler={goBackToToday}
					/>
					<ValidateButton
						aria-label={"close calendar"}
						handler={onClose}
					/>
				</Footer>
			</Container>
			<BackdropBg />
		</Window>
	)
}

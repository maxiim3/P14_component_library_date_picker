import React, {useContext, useMemo, useState} from "react"
import styled, {css} from "styled-components"
import {CalendarContext, ICalendarContext, OCalendarApi} from "../context"
import {OButtonProps, OCalendarContextProp, OClassName, OClick} from "../types"
import BasedButton from "./atoms/based.button.styled"
import {AiOutlineCheck} from "react-icons/all"
import {theme} from "../Theme"

//region models
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
// const dayCellFactory = (props: ICalendarDayCell) => {
// 	const isBlank = props.isBlank || false
// 	const dayIndex = props?.dayIndex || undefined
// 	const dayOfWeek = props?.dayOfWeek ?? undefined
// 	const fullDate = props?.fullDate || undefined
// 	const isToday = props?.isToday || false
// 	const isSelected = false
//
// 	const dayModel = {
// 		dayIndex,
// 		dayOfWeek,
// 		isBlank,
// 		fullDate,
// 		isToday,
// 		isSelected,
// 	}
//
// 	type ActionsProps = {
// 		type: "setIsSelected"
// 		payload: boolean
// 	}
//
// 	function reducer(prev: ICalendarDayCell, action: ActionsProps) {
// 		switch (action.type) {
// 			case "setIsSelected":
// 				return {...prev, isSelected: action.payload}
// 			default:
// 				return prev
// 		}
// 	}
//
// 	const [dayCell, dispatchDayCell] = useReducer(reducer, dayModel)
// 	const setIsSelected = (value: boolean) => {
// 		dispatchDayCell({type: "setIsSelected", payload: value})
// 	}
//
// 	return {
// 		...dayCell,
// 		setIsSelected,
// 	}
// }
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
type ODayCellFactory = ReturnType<typeof dayCellFactory>
//endregion

//region utils
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
function convertMonthToString(month: number) {
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

//endregion

//region hooks
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

//endregion

//region components
//region atoms
/**
 * @description Styled Component for the Calendar container
 * @atom
 * @styled-components
 * @component
 * @container
 * @see Calendar
 * @see Window
 */
const Container = styled.div`
	isolation: inherit;
	position: relative;
	top: ${window.innerHeight / 3};
	left: ${window.innerWidth / 3};
	z-index: 2;
	width: clamp(250px, 50vw, 500px);
	margin-inline: auto;
	border: 1px solid black;
	border-radius: 8px;
	font-size: 0.8rem;
	padding: 8px 12px;
	background: ${theme.mono(98)};
`

/**
 * @description Styled Component that takes whole viewPort and wraps both the Calendar and the background BackdropBg
 * @atom
 * @styled-components
 * @component
 * @container
 * @see Calendar
 * @see BackdropBg
 * @see Container
 * @see Header
 */
const Window = styled.div`
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 0;
	isolation: isolate;
	overflow: hidden;
	display: grid;
	place-content: center;
`

/**
 * @description Styled Component for the background of the Calendar. takes whole width and has blurry effect
 * @atom
 * @absolutePos
 * @styled-components
 * @component
 * @see Calendar
 * @see Window
 * @see Container
 * @see Header
 */
const BackdropBg = styled.div`
	isolation: inherit;
	position: absolute;
	top: 0;
	left: 0;
	content: "";
	width: 100vw;
	height: 100vh;
	background-color: hsla(0, 0%, 30%, 0.5);
	backdrop-filter: blur(2px);
	z-index: 1;
`
/**
 * @description Styled Component for the Calendar header (container navigation and close button)
 * @atom
 * @styled-components
 * @component
 * @see Calendar
 * @see CloseButton
 * @see Navigation
 */
const Header = styled.header`
	width: 100%; // takes the whole width available
	display: flex;
	justify-content: space-between; // So elements are evely spaced/stretched
	align-items: center;
	gap: 12px; // space between Navigation and close-button
`

/**
 * @description Styled Component for that provides navigation between the month and years
 * @see Calendar
 * @atom
 * @container
 * @styled-components
 * @component
 */
const Navigation = styled.nav`
	width: 75%; // So it does not takes the whole width available
	display: flex;
	margin-inline: auto; // So it remains centered
	justify-content: space-between; // So elements are evely spaced/stretched
	align-items: center; // Y axis alignment
`

/**
 * @description Styled Component for the main content of the calendar
 * @atom
 * @container
 * @styled-components
 * @component
 * @see Calendar
 */
const Main = styled.main`
	display: grid;
	grid: repeat(7, 1fr) / repeat(7, 1fr);
`
const Footer = styled.footer`
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	justify-content: center;
	align-items: center;
	gap: 12px;
`

/**
 * @description Styled Component for the days of the week cell [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
 * @see Calendar
 * @atom
 * @styled-components
 * @component
 */
const DayOfWeekCell = styled.span`
	font-weight: bold;
	text-align: center;
`

/**
 * @description Styled Component for a uniq day cell
 * @atom
 * @styled-components
 * @component
 * @see Calendar
 */
const DayCell = styled.span<ODayCellFactory & {isSelected: boolean}>`
	${props => {
		if (props.isBlank)
			return css`
				background-color: ${theme.mono(82)};
				pointer-events: none;
			`

		if (props.isSelected)
			return css`
				background-color: ${theme.accent(80)};
				color: ${theme.accent(34)};
			`
		if (props.isToday)
			return css`
				background-color: ${theme.success(85)};
				color: ${theme.success(42)};
			`
		return css`
			background-color: transparent;
			color: black;
		`
	}}
	border: 1px solid ${theme.mono(92)};
	border-radius: 0;
	padding: 4px;
	text-align: center;
	transition: background-color 0.2s ease-in-out;

	&:hover {
		background-color: ${theme.accent(92)};
		color: ${theme.accent(42)};
		cursor: pointer;
	}
`
/**
 * @description Styled Component for the navigation button (navigate between months)
 * @see Calendar
 * @atom
 * @button
 * @styled-components
 * @component
 */
const NavButton = styled(BasedButton)`
	color: ${theme.accent(20)};
	background-color: ${theme.accent(95)};
	font-size: 1rem;

	&:hover,
	&:active {
		background-color: ${theme.accent(92)};
	}
`

//endregion
//region molecules

/**
 * @description Styled Component to display the date currently selected by the user in the calendar
 * @atom
 * @styled-components
 * @component
 * @see Calendar
 * @see ICalendarContext
 * @param {ICalendarContext} date
 * @return {JSX.Element}
 * @constructor
 */
const SelectedDate = styled((props: OCalendarContextProp & OClassName) => {
	const {selectedDate} = props.date
	return (
		<p
			tabIndex={selectedDate ? 0 : -1}
			aria-label={selectedDate && `selected-date : ${selectedDate}`}
			className={props.className}>
			{convertDateToLocalString(selectedDate && selectedDate)}
		</p>
	)
})`
	place-self: center;
	font-family: inherit;
	font-weight: bold;
	font-size: 1rem;
`

const BackToTodayButton = styled(
	({handler: goBackToToday, className}: OButtonProps & OClassName) => {
		return (
			<BasedButton
				className={className}
				onClick={goBackToToday}>
				Today
			</BasedButton>
		)
	}
)`
	place-self: center;
	padding: 8px;
	color: ${theme.accent(20)};
	background-color: ${theme.accent(95)};
`

const ValidateButton = styled(({handler: onClose, className}: OButtonProps & OClassName) => {
	return (
		<BasedButton
			className={className}
			onClick={onClose}>
			<AiOutlineCheck /> OK
		</BasedButton>
	)
})`
	place-self: center;
	padding: 8px;
	color: ${theme.success(20)};
	background-color: ${theme.success(95)};
`

/**
 * @description Styled Component to display the date currently visible by the user in the calendar
 * @atom
 * @styled-components
 * @component
 * @param {ICalendarContext} date
 * @return {JSX.Element}
 * @see Calendar
 * @see ICalendarContext
 */
const VisibleDate = styled((props: OClassName) => {
	//region State
	const {calendar, setDisplayedDate} = useCalendarApi() // Calendar Context

	const [editableMonth, setEditableMonth] = useState(false) // toggles State between editable and not editable
	const [editableYear, setEditableYear] = useState(false) // toggles State between editable and not editable

	const [localMonthState, setLocalMonthState] = useState(calendar.today.getMonth()) // local state to display the default value of the select
	const [localYearState, setLocalYearState] = useState(calendar.today.getFullYear()) // local state to display the default value of the select
	//endregion
	//region handlers
	const updateMonth = (e: OClick) => {
		e.preventDefault()
		const {value} = e.currentTarget as HTMLButtonElement
		const selectedMonth = parseInt(value)
		const currentVisibleDate = calendar.displayedDate
		const updatedDate = new Date(currentVisibleDate.setMonth(selectedMonth))
		setDisplayedDate(e, updatedDate)
		setEditableMonth(false)
		setLocalMonthState(selectedMonth)
	}

	const updateYear = (e: OClick) => {
		e.preventDefault()
		const {value} = e.currentTarget as HTMLButtonElement
		const selectedYear = parseInt(value)
		const currentVisibleDate = calendar.displayedDate
		const updatedDate = new Date(currentVisibleDate.setFullYear(selectedYear))
		setDisplayedDate(e, updatedDate)
		setEditableYear(false)
		setLocalYearState(selectedYear)
	}
	//endregion

	return (
		<span className={props.className}>
			{(() => {
				if (editableMonth)
					return (
						<select
							onChange={updateMonth}
							name="month"
							defaultValue={localMonthState}
							id="month">
							{Array.from({length: 12}, (_, i) => i).map(month => {
								return (
									<option
										key={crypto.randomUUID()}
										value={month}>
										{convertMonthToString(month)}
									</option>
								)
							})}
						</select>
					)
				return (
					<BasedButton onClick={() => setEditableMonth(true)}>
						{convertMonthToString(calendar.displayedDate.getMonth())}
					</BasedButton>
				)
			})()}
			{(() => {
				if (editableYear)
					return (
						<select
							name="year"
							onChange={updateYear}
							defaultValue={localYearState}
							id="year">
							{Array.from(
								{length: 80},
								(_, i) => i + calendar.today.getFullYear() - 80 + 1
							)
								.reverse()
								.map(year => {
									return (
										<option
											key={crypto.randomUUID()}
											value={year}>
											{year}
										</option>
									)
								})}
						</select>
					)
				return (
					<BasedButton onClick={() => setEditableYear(true)}>
						{calendar.displayedDate.getFullYear()}
					</BasedButton>
				)
			})()}
		</span>
	)
})`
	display: flex;
	font-family: inherit;
	gap: 8px;
	font-size: 1rem;
`

/**
 * @description Calendar component that renders the row of week days
 * @component
 * @molecule
 * @see Calendar
 * @see DayOfWeekCell
 * @return {JSX.Element}
 * @constructor
 */
function HeaderRow() {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
	return (
		<>
			{days.map(day => (
				<DayOfWeekCell key={crypto.randomUUID()}>{day}</DayOfWeekCell>
			))}
		</>
	)
}

/**
 * @description Calendar component that renders the days of the month that are visible to the user
 * @component
 * @molecule
 * @see Calendar
 * @see DayCell
 * @param {ODayCellFactory[]} days - Array of days to render
 * @return {JSX.Element}
 * @constructor
 */
function RowsOfDays({days}: {days: ODayCellFactory[]}) {
	const {setSelectedDate, calendar} = useCalendarApi()
	const handleSelectDay = (e: OClick, day: ODayCellFactory) => {
		e.preventDefault()
		setSelectedDate(e, day.fullDate!)
	}

	return (
		<>
			{days.map(day => (
				<DayCell
					tabIndex={day.isBlank ? -1 : 0}
					aria-label={day.fullDate?.toDateString()}
					isSelected={
						day.fullDate === calendar.selectedDate
					} /*todo Bug selection feedback is not persistant*/
					key={crypto.randomUUID()}
					onClick={(e: OClick) => handleSelectDay(e, day)}
					{...day}>
					{day.dayIndex}
				</DayCell>
			))}
		</>
	)
}

export const CloseButton = styled(({className, handler: onClose}: OButtonProps & OClassName) => {
	return (
		<BasedButton
			onClick={onClose}
			className={className}>
			X
		</BasedButton>
	)
})`
	padding: 12px;
	color: ${theme.error(12)};
	background-color: ${theme.error(98)};
`
//endregion
//region organisms

export type CalendarProps = {
	onClose: (e: OClick) => void
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
	//region states & hooks
	const {calendar, setDisplayedDate} = useCalendarApi()
	const {displayedDate} = calendar
	const mayDays = useMemo(() => initDaysMapping(displayedDate), [displayedDate])
	//endregion
	//region handlers
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

	//endregion

	//region render
	return (
		<Window tabIndex={-1}>
			<Container
				role={"dialog"}
				aria-label={"Calendar opened"}>
				<Header>
					<Navigation aria-label={"calendar navigation"}>
						<NavButton
							aria-label={"previous month button"}
							aria-describedby={"Select to go to the previous month"}
							onClick={previousMonth}>
							{"<"}
						</NavButton>
						<VisibleDate />
						<NavButton
							aria-label={"next month button"}
							aria-describedby={"Select to go to the next month"}
							onClick={nextMonth}>
							{">"}
						</NavButton>
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
	//endregion
}

//endregion
//endregion

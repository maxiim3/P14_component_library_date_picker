import styles from "./organismsUI.module.css"
import {OButtonProps, OCalendarContextProp, OClassName, OClick} from "../../misc/types"
import React, {useState} from "react"
import BasedButton from "../atoms/based.button.styled"
import {DayCell, DayOfWeekCell} from "../atoms/atomesUI.styled"
import {AiOutlineCheck} from "react-icons/all"
import {
	convertDateToLocalString,
	convertMonthToString,
	ODayCellFactory,
	useCalendarApi,
} from "../Calendar"

/**
 * @description Styled Component to display the date currently selected by the user in the calendar
 * @atom
 * @component
 * @see Calendar
 * @see ICalendarContext
 * @param {ICalendarContext} date
 * @return {JSX.Element}
 * @constructor
 */
export const SelectedDate = (props: OCalendarContextProp) => {
	const {selectedDate} = props.date
	return (
		<p
			tabIndex={selectedDate ? 0 : -1}
			aria-label={selectedDate && `selected-date : ${selectedDate}`}
			className={styles.selectDate}>
			{convertDateToLocalString(selectedDate && selectedDate)}
		</p>
	)
}
export const BackToTodayButton = ({
	handler: goBackToToday,
	className,
}: OButtonProps & OClassName) => (
	<BasedButton
		backButton
		onClick={goBackToToday}>
		Today
	</BasedButton>
)

export const ValidateButton = ({handler: onClose}: OButtonProps) => {
	return (
		<BasedButton
			validation
			onClick={onClose}>
			<AiOutlineCheck /> OK
		</BasedButton>
	)
}
/**
 * @description Styled Component to display the date currently visible by the user in the calendar
 * @atom
 * @component
 * @param {ICalendarContext} date
 * @return {JSX.Element}
 * @see Calendar
 * @see ICalendarContext
 */
export const VisibleDate = () => {
	const {calendar, setDisplayedDate} = useCalendarApi() // Calendar Context

	const [editableMonth, setEditableMonth] = useState(false) // toggles State between editable and not editable
	const [editableYear, setEditableYear] = useState(false) // toggles State between editable and not editable

	const [localMonthState, setLocalMonthState] = useState(calendar.today.getMonth()) // local state to display the default value of the select
	const [localYearState, setLocalYearState] = useState(calendar.today.getFullYear()) // local state to display the default value of the select
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

	return (
		<span className={styles.visibleDate}>
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
}

/**
 * @description Calendar component that renders the row of week days
 * @component
 * @molecule
 * @see Calendar
 * @see DayOfWeekCell
 * @return {JSX.Element}
 * @constructor
 */
export function HeaderRow() {
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
export function RowsOfDays({days}: {days: ODayCellFactory[]}) {
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

export const CloseButton = ({handler: onClose}: OButtonProps) => {
	return (
		<BasedButton
			onClick={onClose}
			closeButton>
			X
		</BasedButton>
	)
}

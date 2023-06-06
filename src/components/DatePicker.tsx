import React, {useCallback, useEffect, useRef, useState} from "react"
import {OClassName, OClick} from "../misc/types"
import {createPortal} from "react-dom"
import {Calendar, convertDateToLocalString, useCalendarApi} from "./Calendar"
import {BsFillCalendarEventFill} from "react-icons/all"
import BasedButton from "./atoms/based.button.styled"
import styles from "/datePickerUI.module.css"

type TOpenCalendarButtonProps = {
	onOpen: (e: OClick) => void
	isOpened: boolean
} & OClassName

/**
 * @description Displays styles for the button that opens the calendar and its children
 * @see DatePicker
 * @button
 * @molecule
 * @component
 **/
const OpenCalendarButton = ({onOpen, isOpened, className}: TOpenCalendarButtonProps) => {
	return (
		<BasedButton
			openCalendarButton
			tabIndex={0}
			aria-label={"Open Calendar"}
			aria-describedby={"Select to open the calendar modal"}
			className={className}
			onClick={onOpen}
			disabled={isOpened}>
			<label tabIndex={-1}>Open Calendar</label>
			<span tabIndex={-1}>
				<BsFillCalendarEventFill />
			</span>
		</BasedButton>
	)
}

/**
 * # Date Picker
 * @description Main Date Picker component
 * @component
 * @main
 * @organism
 * @see CalendarProvider
 * @see CalendarContext
 * @see initialCalendarContextFactory
 * @see initialCalendarContext
 * @see ICalendarContext
 * @see OCalendarApi
 * @see OReducerActions
 * @see reduceCalendar
 * @return {JSX.Element}
 * @constructor
 */
export function DatePicker({inputLabel, className}: {inputLabel: string} & OClassName) {
	const slug = useRef(inputLabel.trim().toLowerCase().split(" ").join("-")).current
	const {calendar} = useCalendarApi()
	const [calendarVisibility, setCalendarVisibility] = useState(false)

	const saveDate = () => {
		if (calendar?.selectedDate) {
			if (sessionStorage.getItem(slug)) {
				sessionStorage.removeItem(slug)
			}
			sessionStorage.setItem(slug, calendar.selectedDate.toDateString())
		}
	}

	useEffect(() => saveDate(), [calendar])
	const openCalendar = useCallback((e: OClick) => {
		e.preventDefault()
		setCalendarVisibility(true)
	}, [])

	const closeCalendar = () => setCalendarVisibility(false)

	return (
		<>
			<div
				tabIndex={-1}
				aria-label={"date-picker"}
				className={styles.stack}>
				<label
					className={styles.label}
					tabIndex={0}
					aria-label={"Input Name"}>
					{inputLabel}
				</label>
				<p
					className={styles.p}
					tabIndex={0}
					aria-label={
						calendar?.selectedDate
							? `Selected Value : ${calendar?.selectedDate}`
							: "Please select a date"
					}>
					{
						calendar?.selectedDate
							? convertDateToLocalString(calendar?.selectedDate)
							: "-- -- --"
						// : convertDateToLocalString(calendar.today)
					}
				</p>
				<OpenCalendarButton
					onOpen={openCalendar}
					isOpened={calendarVisibility}
				/>
			</div>
			{calendarVisibility &&
				createPortal(<Calendar onClose={closeCalendar} />, document.body)}
		</>
	)
}

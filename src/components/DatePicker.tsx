import styled from "styled-components"
import React, {useCallback, useEffect, useRef, useState} from "react"
import {OClassName, OClick} from "../types"
import {createPortal} from "react-dom"
import {Calendar, convertDateToLocalString, useCalendarApi} from "./Calendar"
import {BsFillCalendarEventFill} from "react-icons/all"
import BasedButton from "./atoms/based.button.styled"
import {theme} from "../Theme"

//region components
//region atoms
/**
 * @description Displays styles for the container and its children
 * @see DatePicker
 * @styled-components
 * @container
 * @atom
 */
const ContainerStyled = styled.div`
	display: flex;
	flex-direction: row;
	flex-flow: nowrap;
	justify-content: space-between;
	align-items: center;
	width: 450px;
	background-color: ${theme.mono(98)};
	color: ${theme.mono(12)};
	border-radius: 4px;
	padding: 4px 8px;
	margin-inline: auto;
	gap: 4px;
	position: relative;
	font-size: 16px;

	label {
		font-size: 1.2em;
		font-weight: 500;
		user-select: none;
		pointer-events: none;
	}

	p {
		padding: 12px 12px;
		font-size: 1em;
	}
`
//endregion

//region molecules
/**
 * @description Types for the OpenCalendarButton component's props
 * @see OpenCalendarButton
 * **/

type TOpenCalendarButtonProps = {
	onOpen: (e: OClick) => void
	isOpened: boolean
} & OClassName

/**
 * @description Displays styles for the button that opens the calendar and its children
 * @see DatePicker
 * @styled-components
 * @button
 * @molecule
 * @component
 **/
const OpenCalendarButton = styled(({onOpen, isOpened, className}: TOpenCalendarButtonProps) => {
	return (
		<BasedButton
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
})`
	display: flex;
	flex-direction: row;
	flex-flow: nowrap;
	justify-content: center;
	align-items: center;

	gap: 6px;
	font-size: 0.6rem;
	letter-spacing: 0.8px;
	width: 85px;
	padding: 8px 12px;
`
//endregion
//region organisms
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
	//region state

	const slug = useRef(inputLabel.trim().toLowerCase().split(" ").join("-")).current
	const {calendar} = useCalendarApi()
	const [calendarVisibility, setCalendarVisibility] = useState(false)

	useEffect(() => {
		// 	todo add a listener to the document to close the calendar when clicking outside
		// 	todo add a listener to the document to close the calendar when pressing the escape key
		// todo : optional :  add keyboard navigation
		// todo add to local storage
		const saveDate = () => {
			if (calendar?.selectedDate) {
				if (sessionStorage.getItem(slug)) {
					sessionStorage.removeItem(slug)
				}
				sessionStorage.setItem(slug, calendar.selectedDate.toDateString())
			}
		}

		saveDate()
	}, [calendar])
	//endregion

	//region handlers
	const openCalendar = useCallback((e: OClick) => {
		e.preventDefault()
		setCalendarVisibility(true)
	}, [])

	const closeCalendar = useCallback((e: OClick) => {
		e.preventDefault()
		setCalendarVisibility(false)
	}, [])

	//endregion

	//region render component
	return (
		<>
			<ContainerStyled tabIndex={-1} aria-label={'date-picker'} className={className}>
				<label tabIndex={0} aria-label={'Input Name'}>{inputLabel}</label>
				<p tabIndex={0} aria-label={calendar?.selectedDate ? `Selected Value : ${calendar?.selectedDate}` : 'Please select a date'}>
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
			</ContainerStyled>
			{calendarVisibility &&
				createPortal(<Calendar onClose={closeCalendar} />, document.body)}
		</>
	)
	//endregion
}

//endregion

//endregion

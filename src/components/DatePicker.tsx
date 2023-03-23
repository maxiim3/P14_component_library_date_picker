import styled from "styled-components"
import React, {useCallback, useState} from "react"
import {OClassName, OClick} from "../types"
import {createPortal} from "react-dom"
import {Calendar, convertDateToLocalString, useCalendarApi} from "./Calendar"
import {BsFillCalendarEventFill} from "react-icons/all"
import BasedButton from "./atoms/based.button.styled"

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
	border: 1px dashed green;
	width: 450px;
	height: 85px;
	padding: 6px 8px;
	margin-inline: auto;
	gap: 4px;
	position: relative;

	label {
		font-size: 1em;
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
			className={className}
			onClick={onOpen}
			disabled={isOpened}>
			<label>Open Calendar</label>
			<span>
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
export function DatePicker() {
	//region state

	const {calendar} = useCalendarApi()
	const [calendarVisibility, setCalendarVisibility] = useState(false)
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
			<ContainerStyled>
				<h2> Date de naissance</h2>
				<p>
					{calendar?.selectedDate
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

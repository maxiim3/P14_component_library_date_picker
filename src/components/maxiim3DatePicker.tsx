//region App
import {CalendarContext, initialCalendarContextFactory} from "../context"
import {DatePicker} from "./DatePicker"
import React from "react"

export function Maxiim3DatePicker() {
	return (
		<CalendarContext.Provider value={initialCalendarContextFactory()}>
			<DatePicker inputLabel={"Date of birth"} />
		</CalendarContext.Provider>
	)
}


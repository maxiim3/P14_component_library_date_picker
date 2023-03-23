//region App
import {CalendarContext, initialCalendarContextFactory} from "../context"
import {DatePicker} from "./DatePicker"
import React from "react"

export function Maxiim3DatePicker({inputLabel}: {inputLabel: string}) {
	return (
		<CalendarContext.Provider value={initialCalendarContextFactory()}>
			<DatePicker inputLabel={inputLabel} />
		</CalendarContext.Provider>
	)
}


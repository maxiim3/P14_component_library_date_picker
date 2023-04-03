//region App
import {CalendarContext, initialCalendarContextFactory} from "../misc/context"
import {DatePicker} from "./DatePicker"
import React from "react"
import {OClassName} from "../misc/types"

export function Maxiim3DatePicker({inputLabel, className}: {inputLabel: string} & OClassName) {
	return (
		<CalendarContext.Provider value={initialCalendarContextFactory()}>
			<DatePicker className={className} inputLabel={inputLabel} />
		</CalendarContext.Provider>
	)
}


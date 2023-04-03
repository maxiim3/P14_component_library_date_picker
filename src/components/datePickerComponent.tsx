//region App
import {CalendarContext, initialCalendarContextFactory} from "../context"
import {DatePicker} from "./DatePicker"
import React from "react"
import {OClassName} from "../types"

export function DatePickerComponent({inputLabel, className}: {inputLabel: string} & OClassName) {
	return (
		<CalendarContext.Provider value={initialCalendarContextFactory()}>
			<DatePicker className={className} inputLabel={inputLabel} />
		</CalendarContext.Provider>
	)
}


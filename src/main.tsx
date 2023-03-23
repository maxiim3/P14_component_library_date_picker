import React from "react"
import ReactDOM from "react-dom/client"
import {DatePicker} from "./components/DatePicker"
import {CalendarContext, initialCalendarContextFactory} from "./context"

//region __ROOT
const $rootDiv: HTMLElement = document.getElementById("root") as HTMLDivElement
const Root = ReactDOM.createRoot($rootDiv)
//endregion

/* todo next release add darkMode*/

//region App
function App() {
	return (
		<CalendarContext.Provider value={initialCalendarContextFactory()}>
			<DatePicker inputLabel={"Date of birth"} />
		</CalendarContext.Provider>
	)
}

Root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
//endregion

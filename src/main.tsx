import React from "react"
import ReactDOM from "react-dom/client"
import {DatePickerComponent} from "./components/datePickerComponent"

//region __ROOT
const $rootDiv: HTMLElement = document.getElementById("root") as HTMLDivElement
const Root = ReactDOM.createRoot($rootDiv)
//endregion

/* todo next release add darkMode*/

Root.render(
	<React.StrictMode>
		<DatePickerComponent inputLabel={'Date of Birth'} />
	</React.StrictMode>
)
//endregion

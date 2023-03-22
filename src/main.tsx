import React from "react"
import ReactDOM from "react-dom/client"
import {DatePicker} from "./components/DatePicker"

const $rootDiv: HTMLElement = document.getElementById("root") as HTMLDivElement
const Root = ReactDOM.createRoot($rootDiv)
Root.render(
	<React.StrictMode>
		<DatePicker />
	</React.StrictMode>
)


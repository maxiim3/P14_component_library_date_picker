import React from "react"
import ReactDOM from "react-dom/client"
import {Maxiim3DatePicker} from "../src/components/maxiim3DatePicker"

//region __ROOT
const $rootDiv: HTMLElement = document.getElementById("root") as HTMLDivElement
const Root = ReactDOM.createRoot($rootDiv)
//endregion

/* todo next release add darkMode*/

Root.render(
	<React.StrictMode>
		<Maxiim3DatePicker inputLabel={'Date of Birth'} />
	</React.StrictMode>
)
//endregion

import styles from "./button.module.css"
import styled from "../../lib/registery"

const BasedButton = styled("button", {
	css: styles.button,
	variants: {
		isNavButton: {
			true: styles.navButton,
		},
		backButton: {
			true: styles.backButton,
		},
		validation: {
			true: styles.buttonValidation,
		},
		closeButton: {
			true: styles.closeButton,
		},
		openCalendarButton: {
			true: styles.openCalendar
		}
	},
})

export default BasedButton

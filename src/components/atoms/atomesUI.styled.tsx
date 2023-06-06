import styled from "../../lib/registery"
import styles from "./atomsUI.module.css"

/**
 * @description Styled Component for the Calendar container
 * @atom
 * @component
 * @container
 * @see Calendar
 * @see Window
 */
export const Container = styled("div", {
	css: styles.container,
})
/**
 * @description Styled Component that takes whole viewPort and wraps both the Calendar and the background BackdropBg
 * @atom
 * @component
 * @container
 * @see Calendar
 * @see BackdropBg
 * @see Container
 * @see Header
 */
export const Window = styled("div", {
	css: styles.window,
})
/**
 * @description Styled Component for the background of the Calendar. takes whole width and has blurry effect
 * @atom
 * @absolutePos
 * @component
 * @see Calendar
 * @see Window
 * @see Container
 * @see Header
 */
export const BackdropBg = styled("div", {
	css: styles.backdrop,
})

/**
 * @description Styled Component for the Calendar header (container navigation and close button)
 * @atom
 * @component
 * @see Calendar
 * @see CloseButton
 * @see Navigation
 */
export const Header = styled("header", {
	css: styles.header,
})

/**
 * @description Styled Component for that provides navigation between the month and years
 * @see Calendar
 * @atom
 * @container
 * @component
 */
export const Navigation = styled("nav", {
	css: styles.navigation,
})

/**
 * @description Styled Component for the main content of the calendar
 * @atom
 * @container
 * @component
 * @see Calendar
 */
export const Main = styled("main", {
	css: styles.main,
})
export const Footer = styled("footer", {
	css: styles.footer,
})

/**
 * @description Styled Component for the days of the week cell [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
 * @see Calendar
 * @atom
 * @component
 */
export const DayOfWeekCell = styled("span", {
	css: styles.dayOfWeekCell,
})

/**
 * @description Styled Component for a uniq day cell
 * @atom
 * @component
 * @see Calendar
 */
export const DayCell = styled("span", {
	css: styles.dayCell,
	variants: {
		isBlank: {
			true: styles.dayCell__isBlank,
		},
		isSelected: {
			true: styles.dayCell__isSelected,
		},
		isToday: {
			true: styles.dayCell__isToday,
		},
		defaultStyle: {
			true: styles.dayCell__default,
		},
	},
	defaultVariants: {
		defaultStyle: true,
	},
})

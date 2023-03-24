import styled from "styled-components"
import {theme} from "../../Theme"

const BasedButton = styled.button`
	border: none;
	border-radius: 4px;
	transition: all 80ms ease-in-out;
	background-color: ${theme.mono(95)};
	color: ${theme.mono(45)};

	&:hover {
		background-color: ${theme.mono(90)};
		cursor: pointer;
		color: ${theme.mono(20)};
	}

	&:active {
		background-color: ${theme.mono(90)};
		color: ${theme.mono(20)};
		scale: 0.9;
	}
`

export default BasedButton

import styled from "styled-components"

const BasedButton = styled.button`
	border: none;
	border-radius: 4px;
	transition: background-color 120ms ease-in-out, scale 60ms ease-in-out;
	background-color: hsl(0, 0%, 95%);
	color: hsl(0, 0%, 30%);

	&:hover {
		background-color: hsl(0, 1%, 90%);
		cursor: pointer;
		color: hsl(0, 0%, 10%);
	}

	&:active {
		background-color: hsl(0, 0%, 90%);
		color: hsl(0, 0%, 10%);
		scale: 0.9;
	}
`

export default BasedButton

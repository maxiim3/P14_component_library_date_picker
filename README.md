# React Date Picker Component

---

A customizable date picker component for React that allows users to select a date from a calendar.

## Author

This component was created by [Maxiim3](https://github.com/maxiim3).

## Installation

```shell
npm i maxiim3-date-picker
```

Alternatively, you can use Yarn:

```shell
yarn add  maxiim3-date-picker
```

## Usage

```tsx
import {DatePickerComponent} from " maxiim3-date-picker"

function App() {
	return (
		<div>
			<h1>Select a Date</h1>
			<DatePickerComponent inputLabel={"Date of Birth"} />
		</div>
	)
}
```

## Props

The `DatePickerComponent` component accepts the following props:

| Prop Name    | Type     | Required |          Description           |
|--------------|----------|----------|:------------------------------:|
| `inputLabel` | `string` | Yes      | The label for the input field. |

## License

This component is licensed under the [MIT License](https://opensource.org/licenses/MIT).<br>
Feel free to use it in your own projects or modify it to suit your needs.

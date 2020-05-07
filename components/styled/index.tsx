import React from 'react';
import { Button as MuiButton, Select as MuiSelect, Switch as MuiSwitch } from '@material-ui/core';
import styled from 'styled-components';

export const Button = styled(MuiButton)`
	color: ${({ theme }: any) => theme.textColor};
	background-color: #2d49a7;
	:hover,
	:focus {
		background-color: orange;
	}
`;

// export const Switch = styled(MuiSwitch)`
// 	&::-webkit-slider-thumb {
// 		width: 104;
// 		height: 104;
// 	}
// 	track: {
// 		borderradius: 26 / 2;
// 		border: 1px solid lightgrey;
// 		backgroundcolor: grey;
// 		opacity: 1;
// 	}
// `;

// export const Button = styled(({ color, ...other }: any) => {
// 	const aa = 10;
// 	return <MuiButton classes={{ label: 'label' }} {...other} />;
// })`
// 	background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
// 	border: 0;
// 	color: white;
// 	height: 48px;
// 	padding: 0 30px;
// 	box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);

// 	.label {
// 		color: red;
// 	}
// `;

export const Select = styled(MuiSelect)`
	color: ${({ theme }: any) => theme.textColor};
	background-color: #2d49a7;
	padding: 1px 5px;
	:hover,
	:focus {
		background-color: orange;
	}
`;

export const Switch = styled(({ ...other }: any) => <MuiSwitch classes={{ root: 'root', switchBase: 'switchBase', thumb: 'thumb', checked: 'checked', track: 'track' }} {...other} />)`
	.root {
		width: 42;
		height: 26;
		padding: 0;
		margin: 1;
	}

	.switchBase {
		padding: 1;
		&.Mui-checked {
			color: white;
			background-color: #52d869;
			opacity: 1;
			border: none;
			&.Mui-track {
				background-color: green;
			}
		}
	}

	.thumb {
		width: 24;
		height: 24;
	}

	.track {
		border-radius: 13;
		border: 1px solid gray;
		background-color: lightgray;
		opacity: 1;
	}

	.checked {
	}
	.focusVisible {
	}
`;

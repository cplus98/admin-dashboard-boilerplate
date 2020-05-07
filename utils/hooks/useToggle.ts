import { useState, useCallback } from 'react';

export const useToggle = (initialValue: boolean = true): [boolean, (nextValue?: any) => void] => {
	const [value, setValue] = useState<boolean>(initialValue);
	const toggle = useCallback(
		(nextValue?: any): void => {
			if (typeof nextValue === 'boolean') {
				setValue(nextValue);
			} else {
				setValue(currentValue => !currentValue);
			}
		},
		[setValue],
	);
	return [value, toggle];
};

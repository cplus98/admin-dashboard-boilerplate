import { useState, useEffect } from 'react';

export default (method: any) => {
	const [hasRendered, setHasRendered] = useState(false);

	useEffect(() => setHasRendered(true), [hasRendered]);

	if (!hasRendered) {
		method();
	}
};

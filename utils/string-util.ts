export const containSpecialCharacter = (string: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(string);

export const containAlphabet = (string: string) => /[a-zA-Z]/.test(string);

export const containNumber = (string: string) => /[0-9]/.test(string);

export const validateEmail = (email: string) => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

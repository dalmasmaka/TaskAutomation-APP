/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update utils/functions`
*/

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

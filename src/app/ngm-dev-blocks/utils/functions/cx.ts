/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update utils/functions`
*/

import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from 'clsx';

export function cx(...args: ClassValue[]): string {
  return twMerge(clsx(...args));
}

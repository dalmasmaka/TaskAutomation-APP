import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
transform(value: any, limit: number = 50): string {
  console.log('PIPE VALUE:', value);

  if (!value) return '';

  const text = value.toString().trim();

  if (!text) return '';

  return text.length > limit
    ? text.substring(0, limit) + '...'
    : text;
}
}
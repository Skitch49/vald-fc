import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'count',
})
export class CountPipe implements PipeTransform {
  transform(value: any[] | string): number {
    if (value) {
      return value.length;
    } else {
      return 0;
    }
  }
}

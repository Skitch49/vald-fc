import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLength',
})
export class MaxLengthPipe implements PipeTransform {
  transform(value: string, maxLength:number = 250): String {
    if (!value) return '';
    if (value.length <= 120) {
      return value;
    } else {

    const maxLengthValue = value.substring(0, maxLength);
    
    const lastSpaceIndex = maxLengthValue.lastIndexOf(' ');
    
    const result = lastSpaceIndex !== -1 ? maxLengthValue.substring(0, lastSpaceIndex) : maxLengthValue;
    
    return result + '...';
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'forKey',
  pure: false
})
export class ForKeyPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    return Object.keys(value);
  }

}

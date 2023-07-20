import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @HostListener('mouseenter') onMouseEnter() {
    console.log('Mouse entered');
  }
}
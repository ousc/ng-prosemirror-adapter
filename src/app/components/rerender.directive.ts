/**
 * Example:
 *
 * <ng-container *rerender='changingInput'>
 *    this content will be re-rendered everytime `changingInput` changes
 * </ng-container>
 */

import { Directive,
  Input,
  TemplateRef,
  ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[rerender]',
  standalone: true
})
export class RerenderDirective {
  constructor(
    private templateRef:    TemplateRef<any>,
    private viewContainer:  ViewContainerRef
  ) {}

  _rerender: any = undefined

  // if detects changes of the input `val`, clear and rerender the view
  @Input() set rerender(val: any) {
    if(val === this._rerender) return;
    this._rerender = val;
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef);
  }
}

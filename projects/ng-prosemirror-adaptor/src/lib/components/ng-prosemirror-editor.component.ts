import {Component, ElementRef} from "@angular/core";
import {NgProsemirrorAdaptorProvider} from "../ng-prosemirror-adaptor.component";

@Component({
  selector: 'ng-prosemirror-editor',
  template: ``,
  styles: [],
  standalone: true
})
export abstract class NgProsemirrorEditor {

  constructor(public el: ElementRef) {
  }

  public provider: NgProsemirrorAdaptorProvider;
}

import {Directive, ElementRef} from "@angular/core";
import {NgProsemirrorAdapterProvider} from "../ng-prosemirror-adapter.component";

@Directive({
  selector: 'ng-prosemirror-editor',
  standalone: true
})
export abstract class NgProsemirrorEditor {

  constructor(public el: ElementRef) {
  }

  public provider: NgProsemirrorAdapterProvider;
}

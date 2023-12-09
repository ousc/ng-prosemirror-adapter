import {Directive} from "@angular/core";
import {NgProsemirrorAdapterProvider} from "../ng-prosemirror-adapter.component";

@Directive({
  selector: 'ng-prosemirror-comp',
  standalone: true
})
export abstract class NgProsemirrorComp {
  public provider: NgProsemirrorAdapterProvider;
}

import {Directive, ElementRef, Input} from "@angular/core";
import {NgProsemirrorAdapterProvider} from "../ng-prosemirror-adapter.component";
import {CorePluginView} from "@prosemirror-adapter/core";
import {firstElementChild} from "../ng-prosemirror-adapter.service";

@Directive({
  selector: 'ng-prosemirror-plugin',
  standalone: true
})
export abstract class NgProsemirrorPlugin {
  @Input() public key: string;
  @Input() public provider: NgProsemirrorAdapterProvider;

  constructor(public el: ElementRef) {
  }

  get context() {
    return this.provider?.service?.pluginViewContext?.[this.key];
  }

  get view() {
    return this.provider?.service?.pluginViewContext?.[this.key]?.view;
  }

  get state() {
    return this.provider?.service?.pluginViewContext?.[this.key]?.view?.state;
  }

  get prevState() {
    return this.provider?.service?.pluginViewContext?.[this.key]?.prevState;
  }

  get container() {
    return this.el.nativeElement;
  }

  get parentView() {
    return firstElementChild(this.provider.editor.el.nativeElement);
  }

  get pluginView(): CorePluginView<NgProsemirrorPlugin>{
    return null;
  }
}

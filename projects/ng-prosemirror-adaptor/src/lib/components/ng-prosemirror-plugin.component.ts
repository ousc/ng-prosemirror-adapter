import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {NgProsemirrorAdaptorProvider} from "../ng-prosemirror-adaptor.component";
import {CorePluginView} from "@prosemirror-adapter/core";
import {NgEditorViewComponent} from "../ngProsemirrorAdaptor.type";


@Component({
  selector: 'ng-prosemirror-plugin',
  template: ``,
  styles: [],
  standalone: true
})
export abstract class NgProsemirrorPlugin implements AfterViewInit {
  @Input() public key: string;
  @Input() public provider: NgProsemirrorAdaptorProvider;

  @Output() onPluginReady = new EventEmitter<CorePluginView<NgEditorViewComponent>>();

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

  ngAfterViewInit(): void {
    this.onPluginReady.emit(null);
  }
}

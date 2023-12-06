import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {NgProsemirrorAdaptorProvider} from "../ng-prosemirror-adaptor.component";
import {CoreNodeView, CoreWidgetView} from "@prosemirror-adapter/core";
import {NgEditorViewComponent} from "../ngProsemirrorAdaptor.type";


@Component({
  selector: 'ng-prosemirror-widget',
  template: ``,
  styles: [],
  standalone: true
})
export abstract class NgProsemirrorWidget implements AfterViewInit {
  @Input() public key: string;
  @Input() public provider: NgProsemirrorAdaptorProvider;

  constructor(public el: ElementRef) {
  }

  get context() {
    return this.provider?.service?.widgetViewContext?.[this.key];
  }

  get view() {
    return this.provider?.service?.widgetViewContext?.[this.key]?.view;
  }

  get getPos() {
    return this.provider.service.widgetViewContext?.[this.key]?.getPos;
  }

  get spec() {
    return this.provider.service.widgetViewContext?.[this.key]?.spec;
  }

  ngAfterViewInit(): void {
    this.onWidgetViewReady.emit(null);
  }

  @Output() onWidgetViewReady = new EventEmitter<CoreWidgetView<NgEditorViewComponent>>();
}

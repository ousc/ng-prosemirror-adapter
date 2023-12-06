import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {NgProsemirrorAdaptorProvider} from "../ng-prosemirror-adaptor.component";
import {CoreNodeView} from "@prosemirror-adapter/core";
import {NgEditorViewComponent} from "../ngProsemirrorAdaptor.type";


@Component({
  selector: 'ng-prosemirror-node',
  template: ``,
  styles: [],
  standalone: true
})
export abstract class NgProsemirrorNode implements AfterViewInit {
  @Input() public key: string;
  @Input() public provider: NgProsemirrorAdaptorProvider;

  constructor(public el: ElementRef) {
  }

  get context() {
    return this.provider?.service?.nodeViewContext?.[this.key];
  }

  get view() {
    return this.context?.view;
  }

  get contentRef() {
    return this.context?.contentRef;
  }

  get getPos() {
    return this.context?.getPos;
  }

  get setAttrs() {
    return this.context?.setAttrs;
  }

  get node() {
    return this.context?.node;
  }

  get selected() {
    return this.context?.selected;
  }

  get decorations() {
    return this.context?.decorations;
  }
  get innerDecorations(){
    return this.context?.innerDecorations;
  }

  ngAfterViewInit(): void {
    this.onNodeViewReady.emit(null);
    this.context?.contentRef(this.el.nativeElement);
  }

  @Output() onNodeViewReady = new EventEmitter<CoreNodeView<NgEditorViewComponent>>();
}

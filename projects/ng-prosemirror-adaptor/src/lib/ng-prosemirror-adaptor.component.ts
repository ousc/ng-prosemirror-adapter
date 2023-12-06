import {
  Component, ContentChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgProsemirrorAdaptorService} from "./ng-prosemirror-adaptor.service";
import {NgProsemirrorEditor} from "./components/ng-prosemirror-editor.component";

@Component({
  selector: 'ng-prosemirror-adaptor-provider',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content/>`,
  styles: `
    :host {
        display: block;
        width: 100%;
        height: 100%;
    }
  `,
  providers: [NgProsemirrorAdaptorService]
})
export class NgProsemirrorAdaptorProvider {

  private _editorComp: NgProsemirrorEditor;

  @ContentChild(NgProsemirrorEditor, {static: false})
  public set editor(value: NgProsemirrorEditor) {
    this._editorComp = value;
    if (value) {
      this._editorComp.provider = this;
      this.service.editor = this._editorComp;
    }
  }

  public get editor() {
    return this._editorComp;
  }

  constructor(
    public service: NgProsemirrorAdaptorService) {
    this.service.provider = this;
  }

  public createPluginView = this.service.createPluginView;
  public createNodeView = this.service.createNodeView;
  public createWidgetView = this.service.createWidgetView;
}

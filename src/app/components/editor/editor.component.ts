import {AfterViewInit, Component, ElementRef, forwardRef, ViewChild} from '@angular/core';
import {Plugin} from "prosemirror-state";
import {createEditorView} from "../../createEditorView";
import {Size} from "../size.component";
import {Paragraph} from "../paragraph.component";
import {
  NgProsemirrorEditor
} from "../../../../projects/ng-prosemirror-adaptor/src/lib/components/ng-prosemirror-editor.component";
import {Hashes} from "../hashes.component";
import {Heading} from "../heading.component";
import {DecorationSet} from "prosemirror-view";

@Component({
  selector: 'editor',
  standalone: true,
  template: `<div class="editor" #editorRef></div>`,
  styleUrls: ['./editor.component.less'],
  providers: [{provide: NgProsemirrorEditor, useExisting: forwardRef(() => EditorComponent)}],
})
export class EditorComponent extends NgProsemirrorEditor implements AfterViewInit {
  @ViewChild('editorRef') editorRef: ElementRef;

  async ngAfterViewInit(): Promise<void> {
    console.log('editor re-rendered!', this.editorRef)
    const el = this.editorRef.nativeElement;
    if (!el || el.firstChild)
      return;

    createEditorView(this.editorRef.nativeElement, {
      paragraph: this.provider.createNodeView({
        component: Paragraph,
        as: 'div',
        contentAs: 'p',
      }),
      heading: this.provider.createNodeView({ component: Heading }),
    }, [
      new Plugin({
        view: await this.provider.createPluginView({ component: Size }),
      }),
      new Plugin({
        props: {
          decorations: (state) => {
            const getHashWidget = this.provider.createWidgetView({
              as: 'i',
              component: Hashes,
            })
            const {$from} = state.selection
            const node = $from.node()
            if (node.type.name !== 'heading')
              return DecorationSet.empty

            const widget = getHashWidget($from.before() + 1, {
              side: -1,
              level: node.attrs['level'],
            })
            return DecorationSet.create(state.doc, [widget])
          },
        },
      }),
    ]);
  }
}

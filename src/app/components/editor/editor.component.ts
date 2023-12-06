import {AfterViewInit, Component, ElementRef, forwardRef, ViewChild} from '@angular/core';
import {Plugin} from "prosemirror-state";
import {createEditorView} from "../../createEditorView";
import {Size} from "../size.component";
import {Paragraph} from "../paragraph.component";
import {
  NgProsemirrorEditor
} from "../../../../projects/ng-prosemirror-adapter/src/lib/components/ng-prosemirror-editor.component";
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

  /**
   * This is an Angular lifecycle hook that is called after Angular has fully initialized a component's view.
   * It is an asynchronous function that returns a Promise that resolves to void.
   *
   * @returns {Promise<void>} A Promise that resolves to void.
   *
   * The function first logs a message to the console indicating that the editor has been re-rendered.
   * It then gets the native DOM element of the editorRef ViewChild.
   * If the native element is not defined or it already has a child, the function returns.
   * Otherwise, it calls the `createEditorView` function with the native element, an object mapping node names to NodeViewConstructor functions, and an array of ProseMirror plugins.
   * The `paragraph` node is mapped to a NodeViewConstructor function that creates a node view with the Paragraph component, a 'div' wrapper, and a 'p' content wrapper.
   * The `heading` node is mapped to a NodeViewConstructor function that creates a node view with the Heading component.
   * The plugins array includes a plugin that creates a view with the Size component, and a plugin that adds decorations to the editor state.
   * The decorations plugin function gets a widget view with the Hashes component and an 'i' wrapper.
   * It then gets the node at the start of the selection.
   * If the node is not a heading, it returns an empty DecorationSet.
   * Otherwise, it gets a widget with the level attribute of the node and a side of -1, and creates a DecorationSet with the widget.
   */
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

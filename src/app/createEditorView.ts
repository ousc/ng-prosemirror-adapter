import {EditorView, NodeViewConstructor} from "prosemirror-view";
import {EditorState, Plugin} from "prosemirror-state";
import {DOMParser} from "prosemirror-model";
import {schema} from "prosemirror-schema-basic";
import {exampleSetup} from "prosemirror-example-setup";
import {keymap} from "prosemirror-keymap";

/**
 * Creates an instance of EditorView.
 *
 * @param {HTMLElement | ShadowRoot} element - The DOM element or ShadowRoot where the editor will be mounted.
 * @param {Record<string, NodeViewConstructor>} nodeViews - An object mapping node names to NodeViewConstructor functions.
 * @param {Plugin[]} plugins - An array of ProseMirror plugins to be used in the editor.
 *
 * @throws {Error} If the content element is not found in the document.
 *
 * @returns {EditorView} An instance of EditorView.
 *
 * The function first selects the content element from the document. If the content element is not found, it throws an error.
 * Then, it creates an instance of EditorView with the provided element, state, and nodeViews.
 * The state is created using EditorState.Create method with the document parsed from the content element, the schema, and the plugins.
 * The plugins array is composed of the default example setup, a keymap for 'Mod-[' shortcut, and the provided plugins.
 * The 'Mod-[' shortcut is mapped to a function that increases the level of the heading node in the selection if it's less than 6, or sets it to 1 if it's 6 or more.
 */
export function createEditorView(element: HTMLElement | ShadowRoot, nodeViews: Record<string, NodeViewConstructor>, plugins: Plugin[]) {
  const content = document.querySelector('#content')
  if (!content)
    throw new Error('Content element not found')

  return new EditorView(element, {
    state: EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(content),
      schema,
      plugins: [
        ...exampleSetup({schema}),
        keymap({
          'Mod-[': (state, dispatch) => {
            const {selection} = state
            const node = selection.$from.node()
            if (node.type.name !== 'heading')
              return false

            let level = node.attrs['level']
            if (level >= 6)
              level = 1
            else
              level += 1

            dispatch?.(
              state.tr.setNodeMarkup(selection.$from.before(), null, {
                ...node.attrs,
                level,
              }),
            )
            return true
          },
        }),
        ...plugins,
      ],
    }),
    nodeViews,
  })
}

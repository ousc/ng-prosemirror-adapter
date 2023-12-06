import {EditorView, NodeViewConstructor} from "prosemirror-view";
import {EditorState, Plugin} from "prosemirror-state";
import {DOMParser} from "prosemirror-model";
import {schema} from "prosemirror-schema-basic";
import {exampleSetup} from "prosemirror-example-setup";
import {keymap} from "prosemirror-keymap";

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

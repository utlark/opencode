import { Schema } from "effect"
import { createSimpleContext } from "@opencode/ui/context"
import { Persistence } from "@/runtime/persistence/schema"
import { Persist, persisted } from "@/runtime/persistence/storage"

/** The narrowest the session column can be dragged to, in px. */
export const SESSION_COLUMN_WIDTH_MIN = 400

const columnSchema = Persistence.struct({
  width: Persistence.optional(Schema.Finite),
})

// The user-chosen session column width, in px. `undefined` is "auto": the design column
// (`--container-session`), which a drag seeds from the rendered width. A stored width wider
// than the panel is fine: `max-width` clamps it at render time and it returns when the
// panel grows again, without overwriting the stored value.
export const { use: useSessionColumnWidth, provider: SessionColumnWidthProvider } = createSimpleContext({
  name: "SessionColumnWidth",
  gate: false,
  init: () => {
    const [store, setStore] = persisted(Persist.global("session.column-width"), columnSchema, {
      width: undefined,
    })

    return {
      width: () => store.width,
      set(width: number) {
        setStore("width", width)
      },
      reset() {
        setStore("width", undefined)
      },
    }
  },
})

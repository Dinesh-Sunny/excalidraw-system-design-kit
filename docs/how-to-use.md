# How to use the kit

New to Excalidraw libraries? This page goes from zero to fast.

## 1. Words you will see

- **Library** - your personal shelf of reusable drawings in Excalidraw. Open it with the book icon (top right).
- **Library item** - one reusable drawing (a card, a diagram, a screen). Each item in this kit has a name, which makes it searchable.
- **Command Palette** - Excalidraw's "do anything" box. **Cmd/Ctrl + /** or **Cmd/Ctrl + Shift + P**. It lists every named library item.
- **Group** - several shapes that move as one. Every multi-part item in the kit is a group.
- **Binding** - an arrow whose end is attached to a box, so it follows the box when you move it.

## 2. Insert without dragging (the fastest way)

1. Click on the canvas so it has focus (not inside a text box).
2. Press **Cmd/Ctrl + /**.
3. Type part of a name: `redis`, `phone`, `vector`, `tpl/ chat`.
4. Use the arrow keys if needed, then **Enter**. The item lands in the middle of your view.

## 3. Browse and filter in the Library panel

The search box matches **any part of a name**:

| Type | You get |
|---|---|
| `sd:` | the whole kit, in order |
| `sd:data/` | one section (databases) |
| `sd:tpl/` | all 21 full designs |
| `ai client` | only AI clients (chat app, agent, MCP client...) |
| `queue`, `geo`, `jwt` | items tagged with that idea |

Drag an item onto the canvas, or click it.

## 4. Edit what you inserted

- **Rename a card:** double-click once to step into the group, then double-click the text.
- **Move one card out of a template:** double-click to enter the group, then drag it. Or select and **Cmd/Ctrl + Shift + G** to ungroup.
- **Reconnect arrows:** drag an arrow end onto a box until the box highlights, then let go.
- **Change colour:** select, then pick stroke and background in the left panel. The legend item (`sd:guide/ Colour legend`) shows what each colour means.
- **Fit everything on screen:** **Shift + 1**.

## 5. Recommended flow for a design

1. Drop `sd:note/ Requirements` and `sd:note/ Capacity Estimates` on the left.
2. Drop a starter: `sd:client/ First Request - classic` (web/mobile) or `- AI` (AI apps and agents).
3. Add blocks to the right: services, data, cache, queue.
4. Number the flow with `sd:note/ Step 1`, `Step 2`...
5. Mark risks with `sd:note/ Bottleneck` and decisions with `sd:note/ Trade-offs`.
6. Need a head start? Insert a full design from `sd:tpl/` and adapt it.

## 6. Use it on someone else's board

Your library is stored in **your browser**, not inside a drawing. So:

1. Import the kit once on the laptop and browser you will use (do it the day before an interview).
2. Open the other person's live-collaboration link.
3. Insert items from your library as usual. Everyone in the room sees them.

Other whiteboard tools (Miro, FigJam, tldraw) cannot read Excalidraw libraries. There, copy from an Excalidraw tab and paste.

## 7. Updating to a new version

Import the new file the same way. To start clean, remove the old kit items first (Library > ... > select the items > delete), then import.

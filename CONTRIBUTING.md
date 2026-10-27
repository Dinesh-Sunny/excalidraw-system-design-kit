# Contributing

Thanks for helping make the System Design Kit better. Every block, fix and idea counts.

## Quick ways to help

- **Ask or share:** start a thread in [Discussions](https://github.com/Dinesh-Sunny/excalidraw-system-design-kit/discussions).
- **Request a block or design:** [open an item request](https://github.com/Dinesh-Sunny/excalidraw-system-design-kit/issues/new?template=item-request.md).
- **Report a problem:** [open a bug report](https://github.com/Dinesh-Sunny/excalidraw-system-design-kit/issues/new?template=bug.md).
- **Star the repo** so other engineers can find it.
- **Sponsor it** [by card](https://dinesh-sunny.github.io/excalidraw-system-design-kit/sponsor/) (no GitHub account needed) or on [GitHub Sponsors](https://github.com/sponsors/Dinesh-Sunny).

## Add or change blocks

1. Items are code in `generator/src` (`components.js` for blocks, `templates.js` for full designs, `agentic.js` for agent patterns, `ui.js` for screens).
2. Follow the naming rule in [docs/naming.md](docs/naming.md): `sd:<section>/ Item - tags`. Names are the search, so keep them exact.
3. Build and check (see [generator/README.md](generator/README.md)): every item must load and look right in the contact sheets.
4. Open a pull request with a screenshot of the new or changed items.

## Canvas fit rules

Every item is something you drop into a bigger design, so it should sit next to other blocks without taking over the board.

- **Compact footprint.** Groups and flows stay close to square (about 2.5 : 1 at most). Long flows wrap into an L, U or snake shape instead of one long row. Groups of cards use a 2 x 2 grid.
- **Grow down, not sideways.** Notes and key decisions sit under the diagram at its width.
- **On the grid.** Blocks are 160 x 100 (120 when the title has two lines), every diagram uses one block height, and positions snap to 20 px - the Excalidraw grid - so things line up when you move them.
- **Excalidraw type scale.** 36 title, 20 subtitle and group labels, 16 block and note text, 14 arrow labels and captions.
- **Nothing left hanging.** No arrows pointing at nothing. Arrows bind to both blocks, labels sit inside their shapes, and each item moves as one group.

## House rules

- Keep the library file clean: no logos, links or ads inside it.
- Renaming or removing an item is a breaking change (major version). Adding is a minor version.
- Be kind. See the [Code of Conduct](CODE_OF_CONDUCT.md).

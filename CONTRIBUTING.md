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

## House rules

- Keep the library file clean: no logos, links or ads inside it.
- Renaming or removing an item is a breaking change (major version). Adding is a minor version.
- Be kind. See the [Code of Conduct](CODE_OF_CONDUCT.md).

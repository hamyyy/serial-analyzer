# Tauri + Svelte + Nodejs

Just a demo showcasing a lightweight desktop webapp using Rust and Svelte while running a nodejs server as a child-process.

`src/main.ts` starts a Nodejs server instance, making is easy to switch from using electron. Rust handles the window and low level system integration.

Vite used for bundling Svelte frontend.

## Getting started

Before running the dev server, make sure to build the application at least once. This generates the executibles and places [npm serialport](https://www.npmjs.com/package/serialport) dependancies in target directory (demo specific)
```
npm install
npm run build
npm run dev
```


## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/)

## Recommended vscode extensions:

[Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

[Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)

[rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
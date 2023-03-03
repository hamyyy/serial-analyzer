import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { oraPromise } from 'ora';

var copyRecursiveSync = function (src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    try {
      fs.mkdirSync(dest);
    } catch (e) { }
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

/**
 * This function is used to rename the binary with the platform specific postfix.
 * When `tauri build` is ran, it looks for the binary name appended with the platform specific postfix.
 */

async function moveBinaries() {
  let extension = '';

  if (process.platform === 'win32') {
    extension = '.exe'
  }

  const rustInfo = (await execa('rustc', ['-vV'])).stdout;
  const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];

  if (!targetTriple) {
    console.error('Failed to determine platform target triple')
  }

  fs.renameSync(
    `src-tauri/binaries/server${extension}`,
    `src-tauri/binaries/server-${targetTriple}${extension}`
  );

  try {
    // copyRecursiveSync("node_modules/@serialport/bindings-cpp/prebuilds", "src-tauri/binaries/prebuilds")
    copyRecursiveSync("node_modules/@serialport/bindings-cpp/prebuilds", "src-tauri/prebuilds")
  } catch (e) {
    console.error("Tried to copy 'node_modules/@serialport/bindings-cpp/prebuilds' to 'src-tauri/binaries/prebuilds' but failed");
  }
}

/**
 * This function is used to create bundle for server. `Pkg` is not supporting es module resolution
 * that we need to create typesafety within tRPC
 */
async function createBundle() {
  return execa('node_modules/.bin/esbuild', [
    './server', '--bundle', '--outfile=dist/server.js', '--platform=node'
  ]);

  // return execa('node_modules/.bin/tsc', [
  //   '-p', 'server/tsconfig.node.json', '--outDir', 'dist/'
  // ]);
  //.\node_modules\.bin\tsc -p .\server\tsconfig.node.json --outDir dist/
}

/**
 * This function is used to create single executable from server file and nodejs
 */
async function createServerPackage() {
  if (!fs.existsSync("src-tauri/binaries")) {
    fs.mkdirSync("src-tauri/binaries");
  }

  return execa('node_modules/.bin/pkg', ['package.json', '--output', 'src-tauri/binaries/server']);
}

async function main() {
  try {
    await createBundle();
    await createServerPackage();
    await moveBinaries();
  } catch (e) {
    throw e;
  }
}

oraPromise(main, { text: '[TAURINE] Building server...\n', successText: '[TAURINE] Done\n', failText: '[TAURINE] Cannot build server' });

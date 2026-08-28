const packager = require('electron-packager');
const fs = require('fs-extra');
const path = require('path');

// Configuration inputs
const APP_NAME = 'MyScratchGame';
const INPUT_SB3_PATH = path.join(__dirname, 'game.sb3'); // Put your target scratch game file here
const BUILD_TMP_DIR = path.join(__dirname, 'build-tmp');
const OUTPUT_DIR = path.join(__dirname, 'dist');

async function buildLinuxApp() {
  try {
    // 1. Verify that your Scratch file actually exists
    if (!fs.existsSync(INPUT_SB3_PATH)) {
      console.error(`Error: Could not find your game file at: ${INPUT_SB3_PATH}. Please place an .sb3 file there first.`);
      process.exit(1);
    }

    console.log('🧹 Cleaning old build workspaces...');
    await fs.remove(BUILD_TMP_DIR);
    await fs.remove(OUTPUT_DIR);
    await fs.ensureDir(BUILD_TMP_DIR);

    console.log('📦 Assembling standalone distribution files...');
    // Copy the boilerplate files into the temporary compilation workspace
    await fs.copy(path.join(__dirname, 'runtime.html'), path.join(BUILD_TMP_DIR, 'runtime.html'));
    await fs.copy(path.join(__dirname, 'main.js'), path.join(BUILD_TMP_DIR, 'main.js'));
    
    // Inject the target scratch project file and rename it to match runtime configurations
    await fs.copy(INPUT_SB3_PATH, path.join(BUILD_TMP_DIR, 'project.sb3'));

    // Create a local package descriptive template for Electron's engine reader
    const packageJsonContent = {
      name: APP_NAME.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
      version: '1.0.0',
      main: 'main.js'
    };
    await fs.outputJson(path.join(BUILD_TMP_DIR, 'package.json'), packageJsonContent);

    console.log('🚀 Compiling into standalone Linux application binary...');
    const appPaths = await packager({
      dir: BUILD_TMP_DIR,
      name: APP_NAME,
      platform: 'linux',
      arch: 'x64',
      out: OUTPUT_DIR,
      overwrite: true,
      prune: true
    });

    console.log(`\n✅ Success! Your Linux app has been packed to:\n${appPaths[0]}`);
    console.log(`\n👉 To launch your game, run: ./${appPaths[0]}/${APP_NAME}`);
    
    // Cleanup temporary workspace folders
    await fs.remove(BUILD_TMP_DIR);

  } catch (error) {
    console.error('Packaging compilation failure occurred:', error);
  }
}

buildLinuxApp();

import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { ConnectConfig } from '../transport/wire';
import  {promisify, resolveRuntimeVersion, downloadFile } from './util';

const runtimeRoot = 'https://developer.openfin.co/release/runtime/';

export async function download (version: string, folder: string) {
  const url = `${runtimeRoot}mac/x64/${version}`;
  console.log(version, folder);
  const res = await downloadFile(url, path.join(folder, 'tmp'));
  console.log('got runtime');
  console.log(res);
  return folder;
}

export async function getRuntimePath (version: string) : Promise<string> {
  const versionPath = ['OpenFin', 'Runtime', version];
  const HOME = process.env.HOME;
  const mkdir = promisify(fs.mkdir);
  const appendToPath = (next: string) => (val: string) => mkdir(path.join(val, next));
  const catchExistsError = (err: TypeError) => err.code === 'EEXIST' ? err.path : Promise.reject(err);
  return await versionPath.reduce((p: Promise<string>, next: string) => p
    .then(appendToPath(next))
    .catch(catchExistsError), Promise.resolve(HOME)).catch(e => {
      console.log('error in get runtime path');
      console.log(e);
    });
}

export async function install (versionOrChannel: string): Promise < string > {
    const version = await resolveRuntimeVersion(versionOrChannel);
    const rtFolder: string = await getRuntimePath(version);
    const rtPath: string = path.join(rtFolder, 'OpenFin.app/Contents/MacOS/OpenFin');
    const exists = await promisify(fs.stat)(rtPath).catch(e => false);
    if (Boolean(exists)) {
      await promisify(fs.chmod)(rtPath, 0o755);
    } else {
      try {
        await download(version, rtFolder);
      } catch (err) {
        console.error(err);
          throw Error(`Could not install runtime ${versionOrChannel} (${version})`);
      }
    }
    return rtPath;
}

export default async function launch(config: ConnectConfig, manifestLocation: string, namedPipeName: string): Promise < ChildProcess > {
  try {
    const runtimePath = await install(config.runtime.version)
    .catch(e => config.runtime.fallbackVersion
      ? install(config.runtime.fallbackVersion)
      : Promise.reject(e));
    const args = config.runtime.arguments ? config.runtime.arguments.split(' ') : [];

    args.unshift(`--startup-url=${manifestLocation}`);
    const of = spawn(runtimePath, args, {
      encoding: 'utf8'
    });
    return of;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
/**
 * This file is used to automatically bootstrap a NodeCG Server instance.
 * It exports nothing and offers no controls.
 *
 * At this time, other means of starting NodeCG are not officially supported,
 * but they are used internally by our tests.
 *
 * Tests directly instantiate the NodeCGServer class, so that they may have full control
 * over its lifecycle and when the process exits.
 */

import semver from 'semver';
import fetch from 'node-fetch-commonjs';
import { nodecgRootPath } from '../shared/utils/rootPath';

const cwd = process.cwd();

if (cwd !== nodecgRootPath) {
	console.warn('[nodecg] process.cwd is %s, expected %s', cwd, nodecgRootPath);
	process.chdir(nodecgRootPath);
	console.info('[nodecg] Changed process.cwd to %s', nodecgRootPath);
}

// Ours
import { pjson } from './util';
import { NodeCGServer } from './server';
import exitHook from './util/exit-hook';

process.title = 'NodeCG';

process.title += ` - ${String(pjson.version)}`;

const server = new NodeCGServer();
void server.start();

exitHook(() => {
	server.stop();
});

fetch('https://registry.npmjs.org/nodecg/latest')
	.then((res) => res.json())
	.then((body) => {
		if (!body || typeof body !== 'object' || !('version' in body) || typeof body.version !== 'string') {
			return;
		}
		if (semver.gt(body.version, pjson.version)) {
			console.warn('An update is available for NodeCG: %s (current: %s)', body.version, pjson.version);
		}
	})
	.catch((error) => {
		console.error('Failed to check for updates', error);
	});

const hoge = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	throw new Error('hoge');
};

void hoge();

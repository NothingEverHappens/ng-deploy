import { execSync, spawnSync } from 'child_process';

export default function init() {
// TODO(kirjs): Is there a  better way?
    const bin = execSync('(cd ' + __dirname + ' && npm bin)').toString().trim();
    const firebaseBin = bin + '/firebase';
    spawnSync(firebaseBin, ['login'], {stdio: 'inherit'});
    spawnSync(firebaseBin, ['init', 'hosting'], {stdio: 'inherit'});
}

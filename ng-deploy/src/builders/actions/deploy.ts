import { execSync, spawnSync } from "child_process";

export default function deploy() {
    const bin = execSync('(cd ' + __dirname + ' && npm bin)').toString().trim();
    const firebaseBin = bin + '/firebase';
    spawnSync(firebaseBin, ['login'], {stdio: 'inherit'});
    spawnSync(firebaseBin, ['deploy', '--only', 'hosting'], {stdio: 'inherit'});
}

import { arrayFromEnum } from "../src/utils/enum";

const a = 'haha';
const array = ['hey', 'hoy'];
const res = array.find(c => c === a) !== undefined;

console.log(res);

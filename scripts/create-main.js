const package = require('../package.json');
const config = require('../config/config.json');
const path = require('path');
const fs = require('fs-extra');
let importStr = `import './assets/css/public.less'\nimport './assets/css/var.less'\nimport { ObserveVisibility } from 'vue-observe-visibility' \nimport $toast from './Toast/index.js'\n`;
const packages = [];
config.components.map(item => {
  item.packages.forEach(element => {
    let { name ,isDev } = element;
    // 如果是dev状态就添加到脚本文件中
    if(isDev){
      importStr += `import ${name} from './${name}/index.vue';\n`;
      packages.push(name);
    }
  });
});
let installFunction = `function install(Vue) {
  const packages = [${packages.join(',')}];
  packages.forEach((item) => {
    Vue.component(item.name, item);
  });
  Vue.directive("observe-visibility", {
    beforeMount: (el, binding, vnode) => {
      vnode.context = binding.instance
      ObserveVisibility.bind(el, binding, vnode)
    },
    updated: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind
  })
  Vue.config.globalProperties.$toast = $toast
}`;
let fileStr = `${importStr}
${installFunction}
export { ${packages.join(',')} };
export default install;`;
fs.outputFile(
  path.resolve(__dirname, '../packages/main.js'),
  fileStr,
  'utf8',
  error => {
  }
);

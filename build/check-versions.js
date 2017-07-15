// chalk终端字符串美化工具,作用是在控制台中输出不同颜色的字
var chalk = require('chalk')
// semver 用来对特定对版本号做判断
// semver.gt('1.2.3', '9.8.7') false 1.2.3版本比9.8.7版本低
// semver.satisfies('1.2.3', '1.x || >= 2.5.0 || 5.0.0 - 7.2.3') true 1.2.3的版本符合后面的规则
var semver = require('semver')
// 导入package.json文件，要使用里面的engines选项,要注意require是直接可以导入json文件的，并且require返回的就是json对象
var packageConfig = require('../package.json')
// 用来执行Unix系统命令的
var shell = require('shelljs')

function exec(cmd) {
  // 引入child_process 模块 新建子进程，执行Unix命令
  return require('child_process').execSync(cmd).toString().trim()
}

var versionRequirements = [
  {
    name: 'node',
    // 使用semver插件吧版本信息转化成规定格式，也就是 '  =v1.2.3  ' -> '1.2.3' 这种功能
    currentVersion: semver.clean(process.version),
    // 这是规定的pakage.json中engines选项的node版本信息 "node":">= 4.0.0"
    versionRequirement: packageConfig.engines.node
  },
]

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  var warnings = []
  for (var i = 0;i < versionRequirements.length; i++) {
    var mod = versionRequirements[i]
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ": " +
          chalk.red(mod.currentVersion) + ' should be ' +
          chalk.green(mod.versionRequirements)
      )
    }
  }
  
  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules: '))
    console.log()
    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i]
      console.log(' ' + warning)
    }
    console.log()
    process.exit(1)
  }
}
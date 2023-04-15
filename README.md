# Chrome Extension Starter

一个入门项目，使创建 Chrome 扩展变得非常容易 .

### 使用

```bash

git clone https://github.com/cgxqd/chrome-extension-starter.git YOURFOLDERNAME
cd YOURFOLDERNAME

# Run npm install and write your library name when asked. That's all!
npm install
```

### 目录结构
```
|-- chrome-extension-starter
    |-- public
    |   |-- manifest.json           // 扩展配置文件
    |   |-- assets                  // 静态资源
    |-- src
        |-- background.ts           // 后台脚本
        |-- content_script.ts       // 注入html脚本
        |-- devtools                // 控制面板配置页面
        |   |-- index.html
        |   |-- main.ts
        |-- helper                  // 帮助
        |   |-- index.html
        |-- options                 // 选项页面
        |   |-- App.vue
        |   |-- index.html
        |   |-- main.ts
        |-- panel                   // 控制面板页面
        |   |-- App.vue
        |   |-- index.html
        |   |-- main.ts
        |-- popup                   // 扩展程序弹层页面
        |   |-- App.vue
        |   |-- index.html
        |   |-- main.ts
        |-- tools                   // 内置工具函数
            |-- index.ts
            |-- tool.type.ts

```

**开始编码!** 已经为您设置了 `package.json` 和入口文件，只需保持这些文件的名称相同即可。

### 特征

- 零设置. :wink:
- 基于 Vue3 和 TypeScript
- **[Vite](https://cn.vitejs.dev/)** 用于遵循标准约定 Tree Shaking 的多个优化捆绑包
- **[Prettier](https://github.com/prettier/prettier)** 和 **[ESLint](https://eslint.org/)** 用于代码格式和一致性
- **git 挂钩** 使用 [Commitizen](https://github.com/commitizen/cz-cli) 和 [Husky](https://github.com/typicode/husky)

### NPM 命令

- `npm start`: 以监听方式启动项目
- `npm run build`: 打包项目
- `npm run lint`: Lints code

### Git Hooks

> 遵循 COMMIT 规范的 [提交消息](https://github.com/conventional-changelog/conventional-changelog)

已经设置了预提交和提交钩子，用于使用 Prettier 格式化代码 和 ESLint 代码检查 :nail_care:

安装 commitizen 辅助生成标准化规范

```bash
npm install -g commitizen
```

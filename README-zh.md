[English](README.md) | 中文

# 正在进行中

这个仓库刚刚起步，还不能进行实际的使用。

我打算依照 BPMN 的规范，将所有涉及到的 Element 进行实现，目前正在进行中的是 BPMN Core Structure 的实现。后续将对 XML 到对象的转换进行重构，使得实现类能够符合 BPMN 规范。

Here is the document I referred to: https://www.omg.org/spec/BPMN/2.0.2/PDF

# Flowooh

Flowooh 是一个基于 Nodejs + Typescript 的轻量级可扩展工作流。

Flowooh 不依赖于任何服务框架，可以很容易地集成到不同的 Node 服务器应用程序中，如 Express、Koa、NestJs 等。这使得 Flowooh 非常灵活和易于使用。Flowooh 提供了丰富的功能和 api，帮助开发人员快速构建工作流引擎和工作流应用程序。此外，Flowooh 支持插件和扩展，允许开发人员根据自己的需要定制和扩展功能。

# 愿景和目标

工作流引擎在开发中非常常见，并且在社区已经有了优秀的工作流项目，如 Activiti、Flowable、Camunda 等。

然而，在 Node.js 上缺乏类似的工具或项目。我希望构建一个基于 Node.js 的工作流引擎，帮助开发者更好地在 Node.js 服务器上集成和实现工作流应用。

# 快速开始

克隆项目到本地

```bash
$ git clone https://github.com/flowooh/flowooh.git
```

切换目录到 `samples/flowooh-demo-simple`，并安装依赖

```bash
$ cd samples/flowooh-demo-simple
$ npm i
```

创建一个文件名为 `.env` 并在文件中配置环境变量

```.dosini
DEBUG=*
FLOWOOH_DATA_DB_CLIENT=sqlite3
FLOWOOH_DATA_DB_CONNECTION=.db/test.sqlite
```

初始化数据库（Sqlite3）并启动，随后在浏览器中打开 `http://localhost:5173/`

```bash
$ npm run init-db
$ npm run dev
```

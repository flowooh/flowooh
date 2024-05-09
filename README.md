English | [中文](README-zh.md)

# Flowooh

Flowooh is a light-weight extensible workflow based on Nodejs which is built with Typescript.

Flowooh does not rely on any service framework and can easily be integrated into different Node server applications such as Express, Koa, NestJs, etc. This makes Flowooh very flexible and easy to use. Flowooh provides rich features and APIs to help developers quickly build workflow engines and workflow applications. Additionally, Flowooh supports plugins and extensions, allowing developers to customize and extend functionality based on their needs.

# Vision and purpose

Workflow engines are commonly used in development, and there are already excellent workflow projects such as Activiti, Flowable, Camunda, etc.

However, there is a lack of similar tools or projects on Node.js. I hope to build a workflow engine based on Node.js to help developers better integrate and implement workflow applications on the Node.js server.

# Getting Started

Clone the repo to your local machine

```bash
$ git clone https://github.com/flowooh/flowooh.git
```

Switch current directory to `samples/flowooh-demo-simple` and install dependencies

```bash
$ cd samples/flowooh-demo-simple
$ npm i
```

Create a file `.env` and configure it

```.dosini
DEBUG=*
FLOWOOH_DATA_DB_CLIENT=sqlite3
FLOWOOH_DATA_DB_CONNECTION=.db/test.sqlite
```

Init Database(Sqlite3), run script to launch server. then open `http://localhost:5173/` in Browser

```bash
$ npm run init-db
$ npm run dev
```

# Pulling and Submitting Code

If you have any comment or advice, please report your [issue](https://github.com/flowooh/flowooh/issues), or make any change as you wish and submit a [PR](https://github.com/flowooh/flowooh/pulls).

## Pulling Code

Please click the "[Fork](https://github.com/flowooh/flowooh/fork)" button in the main page of Flowooh to fork the latest code into your own repository. Then clone yours to your local machine.

## Install Dependencies

You can install all the dependencies listed in package.json with npm:

```bash
$ npm i
```

## Link to Global

You can link flowooh to global of your local machine, so you can use it in developing locally.

```bash
$ npm run build
$ npm run link:data
```

1. Before you link flowooh to global, you should build it by using `npm run build`.
2. Since Flowooh is a Monorepo built by [Lerna](https://lerna.js.org/), it is not recommend to using `npm link` directly. you can use `npm run link:<package name>` to link certain package to global, such as `npm run link:data` means to link `@flowooh/data` to global.

## Use Flowooh locally

You can use it in your project or sample project locally by `npm link`.

```bash
$ cd path-of-sample-project
$ npm link @flowooh/data
```

Don't forget set environment variables.

```env
FLOWOOH_DATA_DB_CLIENT=sqlite3
FLOWOOH_DATA_DB_CONNECTION=.db/test.sqlite
```

1. You can use sqlite3 to quickly start your service without the need for additional configuration of the database environment. `FLOWOOH_DATA_DB_CONNECTION` could be a file path, the directory should be already exist.
2. You can use the database which [Knex](https://knexjs.org/) is supported.

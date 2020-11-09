# ESLint Linter Action

A GitHub action that evaluates projects with [ESLint](https://eslint.org/) and comments the evaluation outcome on the student's pull request.

## Inputs

This action accepts the following configuration parameters via `with:`

- `token`

  **Required**

  The GitHub token to use for making API requests

## Example usage

```yaml
steps:
  - uses: actions/setup-node@v1.4.3
    with:
      node-version: '12'
  - name: Static code analysis step
    uses: betrybe/eslint-linter-action@v2
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
```

Check the latest version to use [here](https://github.com/betrybe/eslint-linter-action/releases).

## Project constraints

In order for the action to comment the `ESLint` analysis on the pull request, you must:

1. Add `ESLint` into your project's dependencies.

1. Configure the `ESLint` analysis **exclusively** via `.eslintrc.json`.

### Add `ESLint` into your project's dependencies

In order to add `ESLint` into your project you must add `ESLint` as a `dev` dependency:

```shell
npm install eslint --save-dev
```

If you have multiple projects to be evaluated with `ESLint` in the repository, you must add `ESLint` to each project. Beware that each project must have the **same** `ESLint` version, in order to **ensure** that **all** projects are being evaluated under the same conditions (i.e., the same `ESLint` version).

### Configure the `ESLint` analysis **exclusively** via `.eslintrc.json`

In order to configure the `ESLint` analysis for your project, you must create a `.eslintrc.json` file at the root of your project. Therefore, beware the following:

- There cannot be present `ESLint` configurations in the `package.json` of the project;

- There cannot be present inline configurations.

Here follows an example for `.eslintrc.json`:

```json
{
  "env": {
    "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 6
  },
  "rules": {
    "no-console": "error",
    "semi": "error",
    "max-params": ["error", 2]
  }
}
```

If you have multiple projects to be evaluated with `ESLint` in the repository, you must do the following:

- Create a `.eslintrc.json` file **at the root of each project**. There cannot be present a `.eslintrc.json` at **the root of the repository**;

- Add `"root": true` for each `.eslintrc.json`, in order to **ensure** the `ESLint` analysis for one project does not use `ESLint` configured in another project in your repository.

Here follows an example for `.eslintrc.json` defined in one of the projects in your repository:

```json
{
  "root": true,
  "env": {
    "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 6
  },
  "rules": {
    "no-console": "error",
    "semi": "error",
    "max-params": ["error", 2]
  }
}
```

#### Using plugins

You can use plugins in the configuration file `.eslintrc.json`. However, beware to follow the instructions as stated in the plugin's documentation and install all dependencies associated with the plugin. There cannot be any warning raised by `npm` stating uninstalled plugin dependencies when installing a project; otherwise you will have an incomplete `ESLint` analysis environment.

For more information related to configuring `ESLint` with `.eslintrc.json`, read its [guide](https://eslint.org/docs/user-guide/configuring).

## Development

Install the dependencies
```bash
$ npm install
```

Run the tests :heavy_check_mark:
```bash
$ npm test
```

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos. Packaging the action will create a packaged action in the dist folder.

Run package

```bash
npm run pack
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checking to the v1 release branch

```bash
$ git checkout -b v1
$ git commit -a -m "v1 release"
```

```bash
$ git push origin v1
```

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: betrybe/eslint-linter-action@v1
```

See the [actions tab](https://github.com/betrybe/eslint-linter-action/actions) for runs of this action! :rocket:

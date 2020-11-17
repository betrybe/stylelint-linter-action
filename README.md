# Stylelint Linter Action

A GitHub action that evaluates projects with [Stylelint](https://stylelint.io/) and comments the evaluation outcome on the student's pull request.

## Inputs

This action accepts the following configuration parameters via `with:`

- `token`

  **Required**

  The GitHub token to use for making API requests

## Example usage

```yaml
steps:
  - uses: actions/setup-node@v1.4.4
    with:
      node-version: '12'
  - name: Static code analysis step
    uses: betrybe/stylelint-linter-action@v1
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
```

Check the latest version to use [here](https://github.com/betrybe/stylelint-linter-action/releases).

## Running command locally

This GitHub Action run the command:

```
npx stylelint **/*.css --config .stylelintrc.json --formatter json --ignore-disables --allow-empty-input
```

## Project constraints

In order for the action to comment the `Stylelint` analysis on the pull request, you must:

1. Add `Stylelint` into your project's dependencies.

1. Configure the `Stylelint` analysis **exclusively** via `.stylelintrc.json`.

### Add `Stylelint` into your project's dependencies

In order to add `Stylelint` into your project you must add `Stylelint` and its `standard configuration` as a `dev` dependency:

```shell
npm install stylelint stylelint-config-standard --save-dev
```

If you have multiple projects to be evaluated with `Stylelint` in the repository, you must add `Stylelint` to each project. Beware that each project must have the **same** `Stylelint` version, in order to **ensure** that **all** projects are being evaluated under the same conditions (i.e., the same `Stylelint` version).

### Configure the `Stylelint` analysis **exclusively** via `.stylelintrc.json`

In order to configure the `Stylelint` analysis for your project, you must create a `.stylelintrc.json` file at the root of your project. Therefore, beware the following:

- There cannot be present `Stylelint` configurations in the `package.json` of the project;

- There cannot be present inline configurations.

Here follows an example for `.stylelintrc.json`:

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "block-no-empty": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global"]
      }
    ],
    "identation": [
      2,
      {
        "except": ["value"],
        "severity": "warning"
      }
    ]
  }
}
```

If you have multiple projects to be evaluated with `Stylelint` in the repository, you must do the following:

- Create a `.stylelintrc.json` file **at the root of each project**. There cannot be present a `.stylelintrc.json` at **the root of the repository**;

#### Using plugins

You can use plugins in the configuration file `.stylelintrc.json`. However, beware to follow the instructions as stated in the plugin's documentation and install all dependencies associated with the plugin. There cannot be any warning raised by `npm` stating uninstalled plugin dependencies when installing a project; otherwise you will have an incomplete `Stylelint` analysis environment.

For more information related to configuring `Stylelint` with `.stylelintrc.json`, read its [guide](https://stylelint.io/user-guide/configure#plugins).

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
uses: betrybe/stylelint-linter-action@v1
```

See the [actions tab](https://github.com/betrybe/stylelint-linter-action/actions) for runs of this action! :rocket:

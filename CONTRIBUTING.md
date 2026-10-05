# Contributing to AxiSpark.js

We welcome contributions to AxiSpark.js! Whether you're fixing bugs, adding new features, or improving documentation, your help is greatly appreciated. Please follow the guidelines below to ensure a smooth contribution process. Here are some ways you can contribute:

## Found a Bug?

If you encounter a bug, please submit an issue on our GitHub repository. Provide as much detail as possible, including steps to reproduce the bug, expected behavior, and any relevant screenshots or error messages. Here is the link to our [GitHub Issues](https://github.com/axisparkjs/axispark/issues) page.

Please, when opening a new issue, follow the issue template provided. This will help us understand the problem better and address it more efficiently.

```
Title: [Bug] Brief description of the bug

Description: A detailed description of the bug, including steps to reproduce, expected behavior, and actual behavior.

Labels: Please add Bug label and any other relevant labels.
```

## Missing a Feature?

You can also submit a feature request on our GitHub repository. Please describe the feature you would like to see, how it would benefit users, and any relevant use cases. Here is the link to our [GitHub Issues](https://github.com/axisparkjs/axispark/issues) page.

Please, when opening a new feature request, follow the feature request template provided. This will help us understand the feature better and prioritize it accordingly.

```
Title: [Feature] Brief description of the feature

Description: A detailed description of the feature, including its purpose, benefits, and potential use cases.

Labels: Please add Feature label and any other relevant labels.
```

## Submitting a Pull Request for a Bug or Feature

### Development Setup

You need to set up your development environment to contribute code. First, you need [Node.js](https://nodejs.org/) version 24 or higher. Follow these steps:
- Fork the repository on GitHub.
- Clone your forked repository to your local machine.
- Install the necessary dependencies using `npm ci`. If you are modifying docs, you need to install web dependencies using `npm run docs:ci`.

### Branching

For each bug or feature, create a new branch from the `main` branch. Use a descriptive name for your branch, always starting with `feature/` with a brief description of the issue or feature. For example, if you are fixing a bug related to the login functionality, you might name your branch `feature/login-bug-fix`.

Make sure to regularly pull the latest changes from the `main` branch to keep your branch up to date.

### Versioning

When submitting a change, you need to run a changeset before committing your changes. This will generate a changeset file that describes the change you made. The changeset file will be used to update the version of the package when your pull request is merged.

You would run `npm run cd:changeset` and select the type of change you are making:
- "Patch" option if you are fixing a bug
- "Minor" option if you are adding a new feature
- "Major" option if you are making a breaking change

### Commit Messages

When committing your changes, please use clear and descriptive commit messages. Follow this specification for consistency:

The commit message should start with the type of change (e.g., `fix`, `feat`, `docs`, `refactor`, etc.) followed by a `'(#issue-number): '` and a brief description of the change. Here are some examples:
- `fix(#123): Corrected the login validation logic`
- `feat(#456): Added new user profile feature`

### Pull Request Guidelines

When you are ready to submit your changes, create a pull request (PR) from your branch to the `main` branch of the original repository. Please provide a clear and concise description of your changes, including the issue number if applicable. Use the following template for your pull request:

```
Title: [Type] Brief description of the change
Description: A detailed description of the changes made, including any relevant context or references to issues.
- List of changes made
- Any additional information or context that reviewers should be aware of
- Include any relevant screenshots or code snippets if applicable
Labels: Please add the appropriate labels (e.g., Bug, Feature, Documentation) to your pull request.
```

Once your pull request is submitted, it will pass CI pipeline and be reviewed by the maintainers. Please be responsive to any feedback or requests for changes. We appreciate your contributions and look forward to collaborating with you!

### Need to test your package before submitting a pull request?

There is a pipeline that will build an snapshot of your feature branch and publish it to GitHub Packages. You can use this snapshot to test your changes before submitting a pull request. To do this, follow these steps:

If you don't have permission to run the pipeline, please contact the maintainers to request access.
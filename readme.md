
_A CLI tool for generating Shopify sections in Slate_

# Getting Started
The package can be installed globally for use in any project:

```npm i sectionise -g```

You can then run the `sectionise` command to create a new section. Follow the instructions in your console to continue.

For example, providing sectionise with the section name "Image with Text" will result in the follow files being created:

- `src/sections/image-with-text.liquid`
- `src/scripts/sections/image-with-text.js`
- `src/styles/sections/image-with-text.scss`

Each file will be pre-populated with comments and a basic code structure.

# Requirements
The package should only be run inside of a Shopify Slate project. To get started with a Slate project see [Shopify's documentation](https://shopify.github.io/slate/docs/system-requirements).
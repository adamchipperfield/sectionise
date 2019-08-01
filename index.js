#!/usr/bin/env node
const chalk = require('chalk');
const prompt = require('prompt');
const fs = require('fs');
const package = require('./package.json');

/**
 * Data schema.
 */
const schema = {
  properties: {
    title: {
      message: 'Choose a title for your section',
      require: true,
    },
    description: {
      message: 'Define a description for the section',
      required: true,
    },
  },
};

/**
 * Paths.
 */
const paths = {
  liquid: 'src/sections',
  scripts: 'src/scripts/sections',
  styles: 'src/styles/sections',
};

/**
 * Introduction.
 */
console.log(`\n${chalk.green('sectionise v')}${chalk.green(package.version)}\n`);

if (process.argv.length > 2) {
  /**
   * Arguments have been provided.
   */
  const result = {
    title: process.argv[2],
    description: process.argv[3],
  };

  createLiquid(result);
  createScript(result);
  createStyles(result);

  return;
}



/**
 * Request section info.
 */
prompt.start();

prompt.get(schema, function(error, result) {
  if (error) {
    return error;
  }

  createLiquid(result);
  createScript(result);
  createStyles(result);

  console.log(`\n${chalk.yellow('★')}  Section created successfully.\n`);
});

/**
 * Create the liquid file.
 */
async function createLiquid(data) {
  if (!fs.existsSync(paths.liquid)) {
    fs.mkdirSync(paths.liquid, {recursive: true});
  }

  try {
    fs.appendFileSync(`${paths.liquid}/${handleize(data.title)}.liquid`, getSectionTemplate(data));
    console.log(`\n${chalk.green('✓')}${chalk.white('  Liquid file created.')}`);
  } catch (error) {
    return error;
  }
}

/**
 * Create the script file.
 */
function createScript(data) {
  if (!fs.existsSync(paths.scripts)) {
    fs.mkdirSync(paths.scripts, {recursive: true});
  }

  try {
    fs.appendFileSync(`${paths.scripts}/${handleize(data.title)}.js`, getScriptTemplate(data));
    console.log(`\n${chalk.green('✓')}${chalk.white('  Script file created.')}`);
  } catch (error) {
    return error;
  }
}

/**
 * Create the styles file.
 */
function createStyles(data) {
  if (!fs.existsSync(paths.styles)) {
    fs.mkdirSync(paths.styles, {recursive: true});
  }

  try {
    fs.appendFileSync(`${paths.styles}/${handleize(data.title)}.scss`, getStyleTemplate(data));
    console.log(`\n${chalk.green('✓')}${chalk.white('  Style file created.')}`);
  } catch (error) {
    return error;
  }
}

/**
 * Returns the section mark up.
 */
function getSectionTemplate(data) {
  return `{%- comment -%}
----------------------------------------------------------------------------
  Section: ${data.title}
  - ${data.description}
----------------------------------------------------------------------------
{%- endcomment -%}
<section
  class="${handleize(data.title)}"
  data-section-type="${handleize(data.title)}"
  data-section-id="{{ section.id }}"
>

</section>
`;
}

/**
 * Returns the script template.
 */
function getScriptTemplate(data) {
  return `/**
 * Section: ${data.title}
 * ------------------------------------------------------------------------------
 * ${data.description}
 *
 * @namespace ${camelizeHandle(handleize(data.title))}
 */
import {register} from '@shopify/theme-sections';

/**
 * Register the \`${handleize(data.title)}\` section type.
 */
register('${handleize(data.title)}', {

  /**
   * Callback function when section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
   */
  onLoad() {

  },
}); 
`;
}

/**
 * Returns the style template.
 */
function getStyleTemplate(data) {
  return `/**
 * Section: ${data.title}
 * -----------------------------------------------------------------------------
 * ${data.description}
 *
 */
.${handleize(data.title)} {

}
`;
}

/**
 * Handleizes a string.
 * @param {string} string - The string to handleize.
 */
function handleize(string) {
  return string.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Camelizes a handle.
 * @param {string} handle - The handle to camelize.
 */
function camelizeHandle(handle) {
  let string = ``;
  const parts = handle.split('-');

  parts.forEach(function(part, index) {
    if (index === 0) {
      string += part.toLowerCase();
      return;
    }

    string += part.charAt(0).toUpperCase() + part.slice(1)
  });

  return string;
}
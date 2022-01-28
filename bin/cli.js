#!/usr/bin/env node

const { nargs } = require('yargs');

require = require('esm')(module);
kafkacodegen = require('../dist/index');
fs = require('fs');

require('yargs/yargs')(process.argv.slice(2))
  .scriptName('avro-sr-codegen')
  .usage('$0 <command>')
  .command(
    'get [options] url',
    'Get typescript types from a specified schema registry url',
    yargs => {
      yargs.positional('url', {
        type: 'string',
        describe: 'The url of the schema registry',
      });
      yargs.alias('o', 'output');
      yargs.nargs('o', 1);

      yargs.describe('o', 'Output file');
    },
    function(argv) {
      if (argv.output) {
        console.log('Fetching avro schema from ' + argv.url);
      }

      kafkacodegen.generateSchema({ url: argv.url }).then(result => {
        if (argv.output) {
          console.log('Writing avro schema to file ' + argv.output);
          fs.writeFile(argv.output, result, () =>
            console.log('✨ TS types successfully written')
          );
        } else {
          console.log(result);
        }
      });
    }
  )
  .demandCommand()
  .help().argv;

// argv = require('minimist')(process.argv.slice(2));

// function cli() {
//   console.log(argv);
//   if (!argv._[0]) {
//     console.error(
//       'Error: Positional argument for schema registry URL is missing. \n schema-registry-codegen [tags] url'
//     );
//     return;
//   }
//
// }

// cli();

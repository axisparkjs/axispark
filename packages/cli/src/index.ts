#!/usr/bin/env node

import { Command } from 'commander';
import { createCommand } from './commands/create.js';

const program = new Command();

program.name('axispark').description('CLI for AxiSpark.js').version('0.0.1');

program.addCommand(createCommand);
program.parseAsync();

#!/usr/bin/env node

import { Command } from 'commander';
import { createCommand } from './commands/create';

const program = new Command();

program.name('axispark').description('CLI for AxiSpark.js');

program.addCommand(createCommand);
program.parseAsync();

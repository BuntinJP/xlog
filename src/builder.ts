#!/usr/bin/env bun
import { $ } from 'bun';
import chalk from 'chalk';
import os from 'os';
import { parseArgs } from 'util';
import * as packageJson from '../package.json';

const HOME_DIR = os.homedir();

const parsed = parseArgs({
  args: Bun.argv,
  options: {
    local: {
      type: 'boolean',
      short: 'l',
    },
    rhel: {
      type: 'boolean',
      short: 'r',
    },
    writer: {
      type: 'boolean',
      short: 'w',
    },
    development: {
      type: 'boolean',
      short: 'd',
    },
    production: {
      type: 'boolean',
      short: 'p',
    },
    helper: {
      type: 'boolean',
    },
  },
  strict: true,
  allowPositionals: true,
});

interface ScriptDescriptions {
  [key: string]: CommandDescription;
}

type CommandDescription = {
  commandName: string;
  description: string;
  shellCommand: string;
  execCommand?: string;
  warning?: string;
  links?: string[];
};

const blank: CommandDescription = {
  commandName: '[ERROR] BLANK [ERROR]',
  description: '[ERROR] This is a blank command. [ERROR]',
  shellCommand: 'neofetch',
};

const sep = chalk.gray('--------------------------------------');

const scriptDescriptions: ScriptDescriptions = {
  help: {
    commandName: 'help',
    description: 'ヘルプを表示します。',
    shellCommand: 'bun run help',
    execCommand: 'bun run src/builder.ts --helper',
  },
  start: {
    commandName: 'start',
    description: '"http://localhost:3000"に対して、hugoでビルドし、サーバーを開きます。',
    shellCommand: 'bun run start',
    execCommand: 'hugo serve -p 3000 -b http://localhost:3000',
    warning: 'ビルド実行&サーバー展開',
  },
  build: {
    commandName: 'build',
    description: '"http://localhost:3000"に対して、hugoでビルドを行います。',
    shellCommand: 'bun run build',
    execCommand: 'bun run src/builder.ts --development',
  },
  'build:rhel': {
    commandName: 'build:rhel',
    description: '"https://dev.buntin.tech"に対して、ビルドを行います。',
    shellCommand: 'bun run build:rhel',
    execCommand: 'bun run src/builder.ts --rhel',
  },
  'build:writer': {
    commandName: 'build:writer',
    description: '"https://dev5500.buntin.tech"に対して、ビルドを行います。',
    shellCommand: 'bun run build:writer',
    execCommand: 'bun run src/builder.ts --writer',
  },
  'build:lan': {
    commandName: 'build:lan',
    description: '"http://192.168.1.13:3000"に対して、ビルドを行います。',
    shellCommand: 'bun run build:lan',
    execCommand: 'bun run src/builder.ts --local',
  },
  'build:prod': {
    commandName: 'build:prod',
    description: '"https://www.xlog.systems"に対して、ビルドを行います。その後、public/sitemap.xmlを、static/sitemap.xmlにコピーします。',
    shellCommand: 'bun run build:prod',
    execCommand: 'bun run src/builder.ts --production',
    warning: '本番ビルド(本番デプロイ前実行)',
  },
  serve: {
    commandName: 'serve',
    description: '"http://127.0.0.1:3000"(Nginxリバースプロキシの宛先)に対して、PHPでWebサーバーを開きます。ローカルでも使用可',
    shellCommand: 'bun run serve',
    execCommand: 'cd public && php -S localhost:3000',

    links: ['http://127.0.0.1:3000', 'https://dev.buntin.tech', 'https://dev.buntin.xyz'],
  },
  'serve:rhel': {
    commandName: 'serve:rhel',
    description: '"localhost:3000"(Nginxリバースプロキシの宛先)に対して、Python3でWebサーバーを開きます。RHELの3000番に繋がるホストネームすべてでアクセス可能です。',
    shellCommand: 'bun run serve:rhel',
    execCommand: 'cd public && python3 -m http.server 3000',
    links: ['https://dev.buntin.tech', 'https://dev.buntin.xyz', 'http://192.168.1.13:3000'],
  },
  'serve:writer': {
    commandName: 'serve:writer',
    description: '"http://localhost:5500"(Nginxリバースプロキシの宛先)に対して、PHPでWebサーバーを開きます。',
    shellCommand: 'bun run serve:writer',
    execCommand: 'cd public && php -S localhost:5500',
    links: ['https://dev5500.buntin.tech', 'https://dev5500.buntin.xyz'],
  },
  'serve:lan': {
    commandName: 'serve:lan',
    description: '"http://192.168.1.13:3000"に対して、PHPでWebサーバーを開きます。',
    shellCommand: 'bun run serve:lan',
    execCommand: 'cd public && php -S 192.168.1.13:3000',
    links: ['http://192.168.1.13:3000'],
  },
};

const genCommandManLogObject = (command: string, message: string, ifBun?: boolean) => {
  let content = '';
  if (ifBun) {
    const scripts = packageJson.scripts as {
      [key: string]: string;
    };
    for (const script of Object.keys(scripts)) {
      const key = script;
      const description = scriptDescriptions[key] || blank;
      const value = `${description.shellCommand}${description.execCommand ? ` (${description.execCommand})` : ''}`;
      const warning = description.warning ? `[${description.warning}] ` : '';
      const descriptionString = description.description;
      console.log(`${warning}${chalk.whiteBright(key)} : ${chalk.green('$')} ${chalk.whiteBright(value)}\n説明: ${descriptionString}`);
      if (description.links) {
        let index = 0;
        for (; index < description.links.length; index++) {
          console.log(chalk.blueBright(`    ${index}. ${description.links[index]}`));
        }
      }
      console.log(sep);
    }
  } else {
    content = '    ' + chalk.green('$ ') + chalk.whiteBright(command) + chalk.blueBright('(') + '    ' + chalk.grey(message) + chalk.blueBright(')');
    console.log(content);
  }
  return content;
};

(async () => {
  if (parsed.values.rhel) {
    const target = 'https://dev.buntin.tech';
    console.log(chalk.grey('Building site for RHEL( ') + chalk.green('https://lizcode.buntin.tech/?folder=/home/liz/gits/xlog') + chalk.grey(' )...'));
    const res = await $`hugo -b ${target}`;
    console.log(sep);
    if (res.exitCode === 0) {
      console.log(chalk.yellow(`Site built for RHEL`));
    } else {
      console.log(chalk.red(`Error building site`));
    }
    console.log(chalk.whiteBright(target));
    console.log(sep);
  } else if (parsed.values.writer) {
    const target = 'https://dev5500.buntin.tech';
    console.log(chalk.grey('Building site for Writer(' + chalk.green('https://lizcode.buntin.tech/?folder=/home/liz/gits/xlog') + chalk.grey(')...')));
    const res = await $`hugo -b ${target}`;
    console.log(sep);
    if (res.exitCode === 0) {
      console.log(chalk.yellow(`Site built for Writer`));
    } else {
      console.log(chalk.red(`Error building site`));
    }

    console.log(chalk.whiteBright(target));
    console.log(sep);
  } else if (parsed.values.local) {
    console.log('Building site for LAN IP...');
    const res = await $`hugo -b http://192.168.1.13:3000`;
    console.log(sep);
    if (res.exitCode === 0) {
      console.log(chalk.yellow(`WebServer running at:`));
      console.log(chalk.green(`http://192.168.1.13:3000`));
    } else {
      console.log(chalk.red(`Error building site`));
    }
    console.log(sep);
  } else if (parsed.values.development) {
    const target = 'http://localhost:3000';
    console.log(chalk.grey('Building site for development(') + chalk.green('http://localhost:3000') + chalk.grey(')...'));
    const res = await $`hugo -b ${target}`;
    console.log(sep);
    if (res.exitCode === 0) {
      console.log(chalk.yellow(`Site built for development`));
    } else {
      console.log(chalk.red(`Error building site`));
    }
    console.log(chalk.whiteBright(target));
    console.log(sep);
  } else if (parsed.values.production) {
    /* 
  hugo -b https://www.xlog.systems && cp public/sitemap.xml static/sitemap.xml
  */
    const target = 'https://www.xlog.systemss';
    console.log(chalk.grey('Building site for production(') + chalk.green(target) + chalk.grey(')...'));
    const res = await $`hugo -b ${target}`;
    console.log(sep);
    if (res.exitCode === 0) {
      console.log(chalk.yellow(`Site built for production`));
    } else {
      console.log(chalk.red(`Error building site`));
    }
    console.log(chalk.whiteBright(target));
    console.log(sep);
    const res2 = await $`cp public/sitemap.xml static/sitemap.xml`;
    if (res2.exitCode === 0) {
      console.log(chalk.yellow(`Sitemap copied`));
    } else {
      console.log(chalk.red(`Error copying sitemap`));
    }
    // await $`cat static/sitemap.xml`;
    console.log(sep);
  } else if (parsed.values.helper) {
    console.log(sep);
    console.log(chalk.whiteBright('HELP:xlog[src/builder.ts|helper-mode] - MAN - DOCS'));
    genCommandManLogObject('bun run help', 'Show help', true);
    console.log(sep);
  }

  console.log(chalk.green('builder.ts done;'));
})();

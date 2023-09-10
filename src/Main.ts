import { readFile, appendFile } from 'fs';
import { ArgumentParser } from 'argparse';
import { findLinks } from './Utils.js';
import { Site } from './Site.js';
import { FilteredSiteCollector } from './FilteredSiteCollector.js';

function parseArguments(): any {
  let parser = new ArgumentParser({ description: "Checking websites for cloudflare captcha" });
  let requredArgs = parser.add_argument_group({ title: 'required arguments' });

  parser.add_argument("-a", "--available", {
    help: "Specifies a output file with a list of available sites"
  });
  parser.add_argument("-c", "--captcha", {
    help: "Specifies a output file with a list of sites that doesn't have a cloudflare captcha"
  });
  requredArgs.add_argument("-i", "--input", {
    help: "Specifies a input file with a list of sites",
    required: true
  });

  return parser.parse_args();
}

function writeLinks(sites: ReadonlyArray<Site>, path: string | undefined): void {
  if (path != undefined) {
    sites.forEach(s => appendFile(path, s.link + '\n', () => { }));
  }
}

function linksToSites(links: ReadonlyArray<string>): ReadonlyArray<Site> {
  return links.map(l => new Site(l));
}

export async function main(): Promise<void> {
  let args = parseArguments();

  readFile(args?.input, async (error, data) => {
    if (error) {
      console.log(error);

      return;
    }

    let collector = new FilteredSiteCollector(linksToSites(findLinks(data.toString())));

    writeLinks((await collector.filterByAvailability()).toSites(), args?.available);

    if (args?.captcha) {
      writeLinks((await collector.filterByAbsenceOfCaptcha()).toSites(), args?.captcha);
    }
  });
}

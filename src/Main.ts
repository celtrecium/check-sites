import { readFile, appendFile } from 'fs';
import { ArgumentParser } from 'argparse';
import { findLinks } from './Utils.js';
import { AvailabilityChecker } from './AvailabilityChecker.js';
import { CaptchaChecker } from './CaptchaChecker.js';

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

function writeLinks(links: ReadonlyArray<string>, path: string | undefined): void {
    if(path != undefined) {
        links.forEach(l => appendFile(path, l + '\n', () => {})); 
    }
}

export function main(): void {
    let args = parseArguments();

    readFile(args?.input, (error, data) => {
        if(error) {
            console.log(error);
        } else {
            let availableLinks = new AvailabilityChecker(findLinks(data.toString())).checkSitesAvailable();
            
            writeLinks(availableLinks, args?.available);

            if(args?.captcha) {
                writeLinks(new CaptchaChecker(availableLinks).getSitesWithoutCapcha(), args?.captcha);
            }
        }
    });
}
import * as Bar from 'cli-progress';
import { formatLink } from './Utils.js';
import fetch from "sync-fetch";

export class CaptchaChecker {
    private _bar: Bar.SingleBar;
    private _links: ReadonlyArray<string>;

    public constructor(links: ReadonlyArray<string>) {
        this._links = links;
        this._bar = new Bar.SingleBar({}, Bar.Presets.shades_classic);
    }

    private getSiteContent(link: string): string {
        return fetch(formatLink(link)).text();
    }

    private hasCaptcha(link: string): boolean {
        return this.getSiteContent(link).includes("Man or machine");
    }

    public getSitesWithoutCapcha(): ReadonlyArray<string> {
        console.log("Checking websites for captcha");
        this._bar.start(this._links.length, 0);

        let result = this._links.filter(l => {
            this._bar.increment();

            return !this.hasCaptcha(l);
        });

        this._bar.stop();

        return result;
}

}
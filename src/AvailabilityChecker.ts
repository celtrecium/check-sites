import * as Bar from 'cli-progress';
import fetch from 'sync-fetch';
import { formatLink } from './Utils.js';

export class AvailabilityChecker {
    private _links: ReadonlyArray<string>;
    private _bar: Bar.SingleBar;
    
    public constructor(links: ReadonlyArray<string>) {
        this._links = links;
        this._bar = new Bar.SingleBar({}, Bar.Presets.shades_classic);
    }

    private isSiteAvailable(link: string): boolean {
        try { 
            fetch(link);
            
            return true;
        } catch { 
            return false; 
        }
    }

    public checkSitesAvailable(): ReadonlyArray<string> {
        console.log("Checking sites for availability");
        this._bar.start(this._links.length, 0);

        let result = this._links.filter(l => { 
            this._bar.increment();

            return this.isSiteAvailable(formatLink(l)); 
        });

        this._bar.stop();

        return result;
    }
}
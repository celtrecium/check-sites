import * as Bar from 'cli-progress';
import { Site } from './Site.js';

export class FilteredSiteCollector {
  private _bar: Bar.SingleBar;
  private _sites: ReadonlyArray<Site>;

  constructor(_sites: ReadonlyArray<Site>) {
    this._bar = new Bar.SingleBar({}, Bar.Presets.shades_classic);
    this._sites = _sites;
  }

  private async process(action: (s: Site) => Promise<boolean>): Promise<void> {
    this._bar.start(this._sites.length, 0);

    let promise = new Promise<boolean>((resolve, _) => resolve(true));

    this._sites.forEach(s => promise = promise.then(_ => {
      this._bar.increment();

      return action(s);
    }));

    await promise;

    this._bar.stop();
  }

  public async filterByAvailability(): Promise<FilteredSiteCollector> {
    console.log("Checking websites for availability");

    await this.process(async s => s.checkAvailability());
    this._sites = this._sites.filter(s => s.isAvailable);

    return this;
  }

  public async filterByAbsenceOfCaptcha(): Promise<FilteredSiteCollector> {
    console.log("Checking websites for lack of captcha");

    await this.process(async s => s.checkPresenceOfCaptcha());
    this._sites = this._sites.filter(s => !s.hasCaptcha);

    return this;
  }

  public toSites(): ReadonlyArray<Site> {
    return this._sites;
  }
}

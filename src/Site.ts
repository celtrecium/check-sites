import { formatLink } from "./Utils";

export class Site {
  public link: string;
  public isAvailable: boolean | undefined;
  public hasCaptcha: boolean | undefined;

  constructor(link: string) {
    this.link = link;
  }

  private async checkAvailable(): Promise<boolean> {
    return fetch(formatLink(this.link)).then(_ => true).catch(_ => false);
  }

  private async checkCaptcha(): Promise<boolean> {
    return fetch(formatLink(this.link)).then(r => !r.ok);
  }

  public async checkPresenceOfCaptcha(): Promise<boolean> {
    if (typeof this.hasCaptcha == "undefined") {
      this.hasCaptcha = await this.checkCaptcha();
    }

    return this.hasCaptcha;
  }

  public async checkAvailability(): Promise<boolean> {
    if (typeof this.isAvailable == "undefined") {
      this.isAvailable = await this.checkAvailable();
    }

    return this.isAvailable;
  }
}


import { BeforeApplicationShutdown, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService implements BeforeApplicationShutdown {
  private logger = new Logger(AppService.name);

  beforeApplicationShutdown() {
    this.logger.log("Gracefully Shutting down..");
  }

  getHello(): string {
    return "Hello World!";
  }
}

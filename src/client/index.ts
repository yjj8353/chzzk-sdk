import Category from "../api/category";
import Channel from "../api/channel";
import Chat from "../api/chat";
import Drops from "../api/drops";
import Live from "../api/live";
import Restriction from "../api/restriction";
import Session from "../api/session";
import User from "../api/user";
import { getAuthCode } from "../utils/auth";

export default abstract class Client {
  // 인증에 필요한 정보들
  private clientId: string;
  private clientSecret: string;
  private code?: string;
  private state?: string;

  // API
  private sessionInstance?: Session;
  private userInstance?: User;
  private channelInstance?: Channel;
  private categoryInstance?: Category;
  private liveInstance?: Live;
  private chatInstance?: Chat;
  private dropsInstance?: Drops;
  private restrictionInstance?: Restriction;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  public async processOAuth2(
    scheme: string = "http",
    host: string = "127.0.0.1",
    port: string | number = 8080,
    path: string = "/"
  ): Promise<void> {
    const auth = await getAuthCode(this.clientId, scheme, host, port, path);
    this.code = auth[0] || "";
    this.state = auth[1] || "";
  }

  get session(): Session {
    if (!this.sessionInstance) {
      this.sessionInstance = new Session();
    }

    return this.sessionInstance;
  }

  get user(): User {
    if (!this.userInstance) {
      this.userInstance = new User();
    }

    return this.userInstance;
  }

  get channel(): Channel {
    if (!this.channelInstance) {
      this.channelInstance = new Channel();
    }

    return this.channelInstance;
  }

  get category(): Category {
    if (!this.categoryInstance) {
      this.categoryInstance = new Category();
    }

    return this.categoryInstance;
  }

  get live(): Live {
    if (!this.liveInstance) {
      this.liveInstance = new Live();
    }

    return this.liveInstance;
  }

  get chat(): Chat {
    if (!this.chatInstance) {
      this.chatInstance = new Chat();
    }

    return this.chatInstance;
  }

  get drops(): Drops {
    if (!this.dropsInstance) {
      this.dropsInstance = new Drops();
    }

    return this.dropsInstance;
  }

  get restriction(): Restriction {
    if (!this.restrictionInstance) {
      this.restrictionInstance = new Restriction();
    }

    return this.restrictionInstance;
  }
}

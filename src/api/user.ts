import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "../env/baseurl";

interface Channel {
  channelId: string;
  channelName: string;
}

export default class User {
  private readonly BASE_URL: string = BASE_URL + "/open/v1/users";

  async getMyInfo(): Promise<Channel> {
    const response: AxiosResponse = await axios.get(this.BASE_URL + "/me", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  }
}

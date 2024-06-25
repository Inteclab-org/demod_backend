import axios from "axios";
import { chatApi, s3Vars } from "../../../config/conf";
import { IUser } from "../../users/users.interface";
import { IRequestFile } from "../../shared/interface/files.interface";
import ErrorResponse from "../../shared/utils/errorResponse";

export class ChatUtils {

  public async initApp({ uid, name, type, user_id }) {
    if (type !== "messenger") {
      const app = { uid: uid, name: name, type: type };
      const user = { uid: `${user_id}` };

      const response = await axios.post(`${chatApi.url}/api/apps/init`,
        { app: app, user: user },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${chatApi.key}`,
          }
        });

      if (![200, 201].includes(response?.status)) {
        console.log(response?.data);
        throw new ErrorResponse(response?.status, `Error fetching app. Cause: ${response?.statusText}`);
      }

      return response?.data;
    }
  };

  public async getChatToken(user_id) {
    try {
      const res = await axios.post(
        `${chatApi.url}/api/users/${user_id}/tokens`,
        {
          expires_in: chatApi.expiresIn
        },
        {
          headers: {
            'Authorization': `Bearer ${chatApi.key}`
          }
        }
      )
      return res?.data?.access_token;
    } catch (error) {
      console.log(error);
    }
  }

  public async syncUser(user: IUser, role?) {
    console.log(user);
    console.log(`${s3Vars.publicImagesEndpoint}/${user.image_src}`);


    try {
      const res = await axios.put(
        `${chatApi.url}/api/users/${user.id}`,
        {
          uid: user.id,
          name: user.full_name,
          email: user.email,
          nickname: user.username,
          picture: `${s3Vars.publicImagesEndpoint}/${user.image_src}`,
          directory: 'DEMOD',
          metadata: {
            company_name: user.company_name,
            role: role
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${chatApi.key}`
          }
        }
      )
      return res?.data;
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteUser(user_id: string) {
    try {
      const res = await axios.post(
        `${chatApi.url}/api/users/${user_id}/trash`, {},
        {
          headers: {
            'Authorization': `Bearer ${chatApi.key}`
          }
        }
      )

      return res?.data;
    } catch (error) {
      console.log(error);
    }
  }
}
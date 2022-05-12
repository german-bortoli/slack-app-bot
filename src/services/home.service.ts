import { ViewsPublishResponse, WebClient } from "@slack/web-api";
import { blocksFromMessages } from "../utils";
import { getAllNewAndOpenMessages } from "./message.service";

/**
 * Publish home view on slack for a specific user
 * @param user_id 
 * @param client 
 * @returns  Promise<ViewsPublishResponse>
 */
export const publishHomeForUser = async (user_id: string, client: WebClient): Promise<ViewsPublishResponse> => {
    const messages = await getAllNewAndOpenMessages();
    const blocks = blocksFromMessages(messages);
      // Call views.publish with the built-in client
      const result = await client.views.publish({
        // Use the user ID associated with the event
        user_id,
        view: {
          // Home tabs must be enabled in your app configuration page under "App Home"
          type: 'home',
          blocks,
        },
      });

      return result;
}
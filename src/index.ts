import 'dotenv/config'; // To use our .env
import { App, BlockStaticSelectAction, LogLevel } from '@slack/bolt';
import { isGenericMessageEvent, isExternalEmailFromDomain } from './utils';
import {
  publishHomeForUser,
  storeMessage,
  updateMessageFromActionBody,
  validateChannelMessageForBot,
} from './services';
import { AppDataSource } from './data-source';

/**
 * Initialize slack application with our environment variables
 */
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel:
    process.env.NODE_ENV === 'develop' ? LogLevel.DEBUG : LogLevel.ERROR,
});

// All the room in the world for your code
(async () => {
  await AppDataSource.initialize();

  /**
   * Message listener, will be called everytime a message is sent to any channel or group
   */
  app.event('message', async ({ client, logger, message, context }) => {
    // Filter out message events with subtypes (see https://api.slack.com/events/message)
    // Is there a way to do this in listener middleware with current type system?
    if (!isGenericMessageEvent(message)) {
      return;
    }

    const isBotInChannel = await validateChannelMessageForBot(client, message);

    if (!isBotInChannel) {
      return;
    }

    try {
      // Fetch user information from Slack
      const userResponse = await client.users.info({
        user: message.user,
      });

      // Fetch team information from Slack to get the organization domain
      const teamResponse = await client.team.info({ team: context.teamId });

      // Check that user email and team domain are fetched properly
      if (!userResponse.user?.profile?.email || !teamResponse?.team?.domain) {
        return;
      }

      // If the user email is the same from the organization domain, ignore the process
      if (
        !isExternalEmailFromDomain(
          userResponse.user.profile.email,
          teamResponse.team.domain,
        )
      ) {
        return;
      }

      // Store the message in the database
      const messageRecord = await storeMessage(message);
      logger.debug('Message stored >>> ', messageRecord);
    } catch (error) {
      logger.error('Error on event message:', error);
    }
  });

  /**
   * Home view action listener, will be called everytime a user clicks on the home view
   */
  app.event('app_home_opened', async ({ event, client, logger }) => {
    try {
      // Fetch all the new and open messages
      const homeViewResponse = await publishHomeForUser(event.user, client);
      logger.debug('Home view published >>> ', homeViewResponse);
    } catch (error) {
      logger.error('Error while processing home view', error);
    }
  });

  /**
   * Block action listener, will be called everytime a user clicks on the picklist action
   */
  app.action<BlockStaticSelectAction>(
    { type: 'block_actions', action_id: /messageSetStatus-(\d+)/ },
    async ({ ack, body, client, logger }) => {
      try {
        const message = await updateMessageFromActionBody(body);
        await publishHomeForUser(body.user.id, client);
        logger.debug('Message status updated >>> ', message);
        ack();
      } catch (error) {
        logger.error('Error on action message status:', error);
      }
    },
  );

  // Start your app
  await app.start(Number(process.env.PORT) || 3000);
  console.log('⚡️ Bolt app is running!');
})();

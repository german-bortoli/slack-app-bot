import 'dotenv/config'; // To use our .env
import { App, LogLevel } from '@slack/bolt';
import { isGenericMessageEvent } from './utils';
import { isExternalEmailFromDomain } from './services';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel:
    process.env.NODE_ENV === 'develop' ? LogLevel.DEBUG : LogLevel.ERROR,
});

// All the room in the world for your code
(async () => {

  // Will listen for every single message from the app.
  app.event('message', async ({ client, logger, message, context }) => {
    // Filter out message events with subtypes (see https://api.slack.com/events/message)
    // Is there a way to do this in listener middleware with current type system?
    if (!isGenericMessageEvent(message)) {
      return;
    }

    try {
      // Fetch user information from Slack
      const userResponse = await client.users.info({
        user: message.user,
      });

      // Fetch team information from Slack to get the organization domain
      const teamResponse = await client.team.info({ team: context.teamId });

      // If the user email is the same from the organization domain, ignore the process
      if (
        !isExternalEmailFromDomain(
          userResponse.user?.profile?.email,
          teamResponse?.team?.domain,
        )
      ) {
        return;
      }

      logger.debug('External User >>> ', userResponse.user);
    } catch (error) {
      logger.error(error);
    }
  });

  app.event('app_home_opened', async ({ event, client, logger }) => {
    try {
      // Call views.publish with the built-in client
      const result = await client.views.publish({
        // Use the user ID associated with the event
        user_id: event.user,
        view: {
          // Home tabs must be enabled in your app configuration page under "App Home"
          type: 'home',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Welcome home, <@' + event.user + '> :house:*',
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Learn how home tabs can be more useful and interactive <https://api.slack.com/surfaces/tabs/using|*in the documentation*>.',
              },
            },
          ],
        },
      });

      logger.info(result);
    } catch (error) {
      logger.error(error);
    }
  });

  // Start your app
  await app.start(Number(process.env.PORT) || 3000);
  console.log('⚡️ Bolt app is running!');
})();

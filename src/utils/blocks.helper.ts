import { Block, KnownBlock } from '@slack/types';
import { Message } from '../entities/message';

type Blocks = (KnownBlock | Block)[];

export const getBlocksForEmptyMessage = (): Blocks => {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'There are no messages from external users.',
      },
    },
  ];
};


export const getBlockMessage = (message: Message): Blocks => {
    return [
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Status:* ${message.status}`,
            },
            {
              type: 'mrkdwn',
              text: '-',
            },
            {
              type: 'mrkdwn',
              text: `*From:* <@${message.user}>`,
            },
            {
              type: 'mrkdwn',
              text: `*Channel:* <#${message.channel}>`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:* \n\n ${message.messageText}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Set Status',
          },
          accessory: {
            type: 'static_select',
            placeholder: {
              type: 'plain_text',
              text: 'New',
              emoji: false,
            },
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'Open',
                  emoji: false,
                },
                value: 'open',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Complete',
                  emoji: false,
                },
                value: 'complete',
              },
            ],
            action_id: `action-set-status-${message.id}`,
          },
        },
        {
          type: 'divider',
        },
      ];
}

export const blocksFromMessages = (messages: Message[]): Blocks => {
  if (messages.length === 0) {
    return getBlocksForEmptyMessage();
  }

  const blocks: Blocks = [];
  messages.forEach((msg: Message) => {
    blocks.push(...getBlockMessage(msg));
  });
  
  return blocks;
};

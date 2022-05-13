import { Block, KnownBlock, SectionBlock } from '@slack/types';
import moment from 'moment';
import { Message } from '../entities/message';

type Blocks = (SectionBlock | Block | KnownBlock)[];

export const getDivider = () => ({type: 'divider'});

/**
 * Fetch an empty block for home view
 * @returns 
 */
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

/**
 * Generate block message from a message
 * @param message 
 * @returns 
 */
export const getBlockMessage = (message: Message): Blocks => {
  const messageFriendlyTime = moment(message.messageTs * 1000).fromNow();
  return [
    {
      type: 'section',
      block_id: `message-${message.clientMessageId}`,
      fields: [
        {
          type: 'mrkdwn',
          text: `*Status:* ${message.status}`,
        },
        {
          type: 'mrkdwn',
          text: `*When:* ${messageFriendlyTime}`,
        },
        {
          type: 'mrkdwn',
          text: `*From:* <@${message.user}>`,
        },
        {
          type: 'mrkdwn',
          text: `*Channel:* <#${message.channel}>`,
        },
        {
          type: 'mrkdwn',
          text: `*Message:* \n\n ${message.messageText}`,
        },
      ],
      accessory: {
        type: 'static_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select status',
          emoji: false,
        },
        options: [
          {
            text: {
              type: 'plain_text',
              text: 'New',
              emoji: false,
            },
            value: 'new',
          },
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
        action_id: `messageSetStatus-${message.id}`,
      },
    },
  ];
};

/**
 * Get blocks section for all messages
 * @param messages 
 * @returns 
 */
export const blocksFromMessages = (messages: Message[]): Blocks => {
  if (messages.length === 0) {
    return getBlocksForEmptyMessage();
  }

  const blocks: Blocks = [];
  messages.forEach((msg: Message) => {
    blocks.push(...getBlockMessage(msg), getDivider());
  });

  return blocks;
};

import { BlockStaticSelectAction, GenericMessageEvent } from '@slack/bolt';
import { In } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Message as MessageEntity, MessageStatus } from '../entities/message';

/**
 * Get all new and open messages sorted by date
 * @returns Promise<MessageEntity[]
 */
export const getAllNewAndOpenMessages = async (): Promise<MessageEntity[]> => {
  const messageRepository = AppDataSource.getRepository(MessageEntity);
  return messageRepository.find({
    where: { status: In([MessageStatus.NEW, MessageStatus.OPEN]) },
    order: { messageTs: 'DESC' },
  });
};

/**
 * Store a message in the database
 * @param message Message to store
 * @returns Promise<MessageEntity>
 */
export const storeMessage = async (
  msg: GenericMessageEvent,
): Promise<MessageEntity> => {
  const dbMessage = new MessageEntity();
  dbMessage.user = msg.user;
  dbMessage.clientMessageId = msg.client_msg_id || '';
  dbMessage.messageText = msg.text || '';
  dbMessage.messageTs = Number(msg.ts);
  dbMessage.channel = msg.channel;

  return AppDataSource.manager.save(dbMessage);
};

export const updateMessageFromActionBody = async (
  body: BlockStaticSelectAction,
): Promise<MessageEntity> | never => {
  if (body.actions.length === 0) {
    throw new Error('No action found');
  }

  const action = body.actions[0];
  const messageId = action.action_id.split('-')[1];
  const messageRepository = AppDataSource.getRepository(MessageEntity);
  const message = await messageRepository.findOneBy({ id: Number(messageId) });
  if (!message) {
    throw new Error('Message not found');
  }

  message.status = action?.selected_option.value;
  return messageRepository.save(message);
};

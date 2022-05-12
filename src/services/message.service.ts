import { GenericMessageEvent } from '@slack/bolt';
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

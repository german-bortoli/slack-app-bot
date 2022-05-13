import {
  GenericMessageEvent,
  MessageEvent,
  ReactionAddedEvent,
  ReactionMessageItem,
} from '@slack/bolt';

/**
 * Check if the message is a generic message event
 * @param msg 
 * @returns 
 */
export const isGenericMessageEvent = (
  msg: MessageEvent,
): msg is GenericMessageEvent =>
  (msg as GenericMessageEvent).subtype === undefined;

/**
 * Check if the message is a message item
 * @param item 
 * @returns 
 */
export const isMessageItem = (
  item: ReactionAddedEvent['item'],
): item is ReactionMessageItem =>
  (item as ReactionMessageItem).type === 'message';

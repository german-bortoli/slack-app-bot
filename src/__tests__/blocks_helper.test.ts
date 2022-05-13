import { Message } from '../entities/message';
import { blocksFromMessages } from '../utils';

describe('Blocks helper', () => {
  it('should return a blocks object', () => {
    const messages: Message[] = [];
    const blocks = blocksFromMessages(messages);
    
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('section');
    expect(JSON.stringify(blocks[0])).toContain(
      'There are no messages from external users',
    );
  });

  it('Should have a block id', () => {
    const messages: Message[] = [{
        id: 1,
        user: 'U0G9QF9S',
        channel: 'C0G9QF9S',
        messageTs: 1588888888,
        messageText: 'test',
        status: 'new',
        clientMessageId: 'aa-11',
    },
    {
        id: 2,
        user: 'U0G9QF9S',
        channel: 'C0G9QF9S',
        messageTs: 1588888888,
        messageText: 'test2',
        status: 'new',
        clientMessageId: 'bb-22',
    }]
    const blocks = blocksFromMessages(messages);
    expect(blocks).toHaveLength(4); // 2 messages + 2 divider
    expect(blocks[0].block_id).toBe('message-aa-11');
    expect(blocks[1].type).toBe('divider');
    expect(blocks[2].block_id).toBe('message-bb-22');
    expect(blocks[3].type).toBe('divider');
  });
});

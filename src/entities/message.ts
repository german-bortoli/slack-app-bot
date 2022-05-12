import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export enum MessageStatus {
    NEW = 'new',
    OPEN = 'open',
    CLOSED = 'closed',
}

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user: string

    @Column()
    channel: string

    @Column()
    clientMessageId: string

    @Column({type: 'blob'})
    messageText: string

    @Column({default: MessageStatus.NEW})
    status: string

    /** 
    //SQLITE DOES NOT SUPPORT ENUMS 
    @Column({
        type: 'enum',
        enum: MessageStatus,
        default: MessageStatus.NEW
    })
    status: MessageStatus
    */

    // SQLite does not support timestamp type
    @Column({ type: "integer" })
    messageTs: number
}
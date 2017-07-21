import * as $protobuf from "protobufjs";

/** Properties of a Sync. */
export interface ISync {

    /** Sync richLogootSOpMsg */
    richLogootSOpMsg?: IRichLogootSOperationMsg;

    /** Sync querySync */
    querySync?: IQuerySync;

    /** Sync replySync */
    replySync?: IReplySync;
}

/** Represents a Sync. */
export class Sync {

    /**
     * Constructs a new Sync.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISync);

    /** Sync richLogootSOpMsg. */
    public richLogootSOpMsg?: (IRichLogootSOperationMsg|null);

    /** Sync querySync. */
    public querySync?: (IQuerySync|null);

    /** Sync replySync. */
    public replySync?: (IReplySync|null);

    /** Sync type. */
    public type?: string;

    /**
     * Creates a new Sync instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Sync instance
     */
    public static create(properties?: ISync): Sync;

    /**
     * Encodes the specified Sync message. Does not implicitly {@link Sync.verify|verify} messages.
     * @param message Sync message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISync, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Sync message, length delimited. Does not implicitly {@link Sync.verify|verify} messages.
     * @param message Sync message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISync, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Sync message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Sync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Sync;

    /**
     * Decodes a Sync message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Sync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Sync;

    /**
     * Verifies a Sync message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Sync message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Sync
     */
    public static fromObject(object: { [k: string]: any }): Sync;

    /**
     * Creates a plain object from a Sync message. Also converts values to other types if specified.
     * @param message Sync
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Sync, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Sync to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a RichLogootSOperationMsg. */
export interface IRichLogootSOperationMsg {

    /** RichLogootSOperationMsg id */
    id?: number;

    /** RichLogootSOperationMsg clock */
    clock?: number;

    /** RichLogootSOperationMsg logootSAddMsg */
    logootSAddMsg?: ILogootSAddMsg;

    /** RichLogootSOperationMsg logootSDelMsg */
    logootSDelMsg?: ILogootSDelMsg;
}

/** Represents a RichLogootSOperationMsg. */
export class RichLogootSOperationMsg {

    /**
     * Constructs a new RichLogootSOperationMsg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRichLogootSOperationMsg);

    /** RichLogootSOperationMsg id. */
    public id: number;

    /** RichLogootSOperationMsg clock. */
    public clock: number;

    /** RichLogootSOperationMsg logootSAddMsg. */
    public logootSAddMsg?: (ILogootSAddMsg|null);

    /** RichLogootSOperationMsg logootSDelMsg. */
    public logootSDelMsg?: (ILogootSDelMsg|null);

    /** RichLogootSOperationMsg type. */
    public type?: string;

    /**
     * Creates a new RichLogootSOperationMsg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RichLogootSOperationMsg instance
     */
    public static create(properties?: IRichLogootSOperationMsg): RichLogootSOperationMsg;

    /**
     * Encodes the specified RichLogootSOperationMsg message. Does not implicitly {@link RichLogootSOperationMsg.verify|verify} messages.
     * @param message RichLogootSOperationMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRichLogootSOperationMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RichLogootSOperationMsg message, length delimited. Does not implicitly {@link RichLogootSOperationMsg.verify|verify} messages.
     * @param message RichLogootSOperationMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRichLogootSOperationMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RichLogootSOperationMsg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RichLogootSOperationMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RichLogootSOperationMsg;

    /**
     * Decodes a RichLogootSOperationMsg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RichLogootSOperationMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RichLogootSOperationMsg;

    /**
     * Verifies a RichLogootSOperationMsg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RichLogootSOperationMsg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RichLogootSOperationMsg
     */
    public static fromObject(object: { [k: string]: any }): RichLogootSOperationMsg;

    /**
     * Creates a plain object from a RichLogootSOperationMsg message. Also converts values to other types if specified.
     * @param message RichLogootSOperationMsg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RichLogootSOperationMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RichLogootSOperationMsg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a LogootSAddMsg. */
export interface ILogootSAddMsg {

    /** LogootSAddMsg id */
    id?: IIdentifierMsg;

    /** LogootSAddMsg content */
    content?: string;
}

/** Represents a LogootSAddMsg. */
export class LogootSAddMsg {

    /**
     * Constructs a new LogootSAddMsg.
     * @param [properties] Properties to set
     */
    constructor(properties?: ILogootSAddMsg);

    /** LogootSAddMsg id. */
    public id?: (IIdentifierMsg|null);

    /** LogootSAddMsg content. */
    public content: string;

    /**
     * Creates a new LogootSAddMsg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LogootSAddMsg instance
     */
    public static create(properties?: ILogootSAddMsg): LogootSAddMsg;

    /**
     * Encodes the specified LogootSAddMsg message. Does not implicitly {@link LogootSAddMsg.verify|verify} messages.
     * @param message LogootSAddMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ILogootSAddMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified LogootSAddMsg message, length delimited. Does not implicitly {@link LogootSAddMsg.verify|verify} messages.
     * @param message LogootSAddMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ILogootSAddMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a LogootSAddMsg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LogootSAddMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LogootSAddMsg;

    /**
     * Decodes a LogootSAddMsg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LogootSAddMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LogootSAddMsg;

    /**
     * Verifies a LogootSAddMsg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a LogootSAddMsg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LogootSAddMsg
     */
    public static fromObject(object: { [k: string]: any }): LogootSAddMsg;

    /**
     * Creates a plain object from a LogootSAddMsg message. Also converts values to other types if specified.
     * @param message LogootSAddMsg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: LogootSAddMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this LogootSAddMsg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an IdentifierMsg. */
export interface IIdentifierMsg {

    /** IdentifierMsg base */
    base?: number[];

    /** IdentifierMsg last */
    last?: number;
}

/** Represents an IdentifierMsg. */
export class IdentifierMsg {

    /**
     * Constructs a new IdentifierMsg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IIdentifierMsg);

    /** IdentifierMsg base. */
    public base: number[];

    /** IdentifierMsg last. */
    public last: number;

    /**
     * Creates a new IdentifierMsg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns IdentifierMsg instance
     */
    public static create(properties?: IIdentifierMsg): IdentifierMsg;

    /**
     * Encodes the specified IdentifierMsg message. Does not implicitly {@link IdentifierMsg.verify|verify} messages.
     * @param message IdentifierMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IIdentifierMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified IdentifierMsg message, length delimited. Does not implicitly {@link IdentifierMsg.verify|verify} messages.
     * @param message IdentifierMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IIdentifierMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an IdentifierMsg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns IdentifierMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): IdentifierMsg;

    /**
     * Decodes an IdentifierMsg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns IdentifierMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): IdentifierMsg;

    /**
     * Verifies an IdentifierMsg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an IdentifierMsg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns IdentifierMsg
     */
    public static fromObject(object: { [k: string]: any }): IdentifierMsg;

    /**
     * Creates a plain object from an IdentifierMsg message. Also converts values to other types if specified.
     * @param message IdentifierMsg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: IdentifierMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this IdentifierMsg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a LogootSDelMsg. */
export interface ILogootSDelMsg {

    /** LogootSDelMsg lid */
    lid?: IIdentifierIntervalMsg[];
}

/** Represents a LogootSDelMsg. */
export class LogootSDelMsg {

    /**
     * Constructs a new LogootSDelMsg.
     * @param [properties] Properties to set
     */
    constructor(properties?: ILogootSDelMsg);

    /** LogootSDelMsg lid. */
    public lid: IIdentifierIntervalMsg[];

    /**
     * Creates a new LogootSDelMsg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LogootSDelMsg instance
     */
    public static create(properties?: ILogootSDelMsg): LogootSDelMsg;

    /**
     * Encodes the specified LogootSDelMsg message. Does not implicitly {@link LogootSDelMsg.verify|verify} messages.
     * @param message LogootSDelMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ILogootSDelMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified LogootSDelMsg message, length delimited. Does not implicitly {@link LogootSDelMsg.verify|verify} messages.
     * @param message LogootSDelMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ILogootSDelMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a LogootSDelMsg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LogootSDelMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LogootSDelMsg;

    /**
     * Decodes a LogootSDelMsg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LogootSDelMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LogootSDelMsg;

    /**
     * Verifies a LogootSDelMsg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a LogootSDelMsg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LogootSDelMsg
     */
    public static fromObject(object: { [k: string]: any }): LogootSDelMsg;

    /**
     * Creates a plain object from a LogootSDelMsg message. Also converts values to other types if specified.
     * @param message LogootSDelMsg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: LogootSDelMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this LogootSDelMsg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an IdentifierIntervalMsg. */
export interface IIdentifierIntervalMsg {

    /** IdentifierIntervalMsg base */
    base?: number[];

    /** IdentifierIntervalMsg begin */
    begin?: number;

    /** IdentifierIntervalMsg end */
    end?: number;
}

/** Represents an IdentifierIntervalMsg. */
export class IdentifierIntervalMsg {

    /**
     * Constructs a new IdentifierIntervalMsg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IIdentifierIntervalMsg);

    /** IdentifierIntervalMsg base. */
    public base: number[];

    /** IdentifierIntervalMsg begin. */
    public begin: number;

    /** IdentifierIntervalMsg end. */
    public end: number;

    /**
     * Creates a new IdentifierIntervalMsg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns IdentifierIntervalMsg instance
     */
    public static create(properties?: IIdentifierIntervalMsg): IdentifierIntervalMsg;

    /**
     * Encodes the specified IdentifierIntervalMsg message. Does not implicitly {@link IdentifierIntervalMsg.verify|verify} messages.
     * @param message IdentifierIntervalMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IIdentifierIntervalMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified IdentifierIntervalMsg message, length delimited. Does not implicitly {@link IdentifierIntervalMsg.verify|verify} messages.
     * @param message IdentifierIntervalMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IIdentifierIntervalMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an IdentifierIntervalMsg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns IdentifierIntervalMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): IdentifierIntervalMsg;

    /**
     * Decodes an IdentifierIntervalMsg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns IdentifierIntervalMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): IdentifierIntervalMsg;

    /**
     * Verifies an IdentifierIntervalMsg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an IdentifierIntervalMsg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns IdentifierIntervalMsg
     */
    public static fromObject(object: { [k: string]: any }): IdentifierIntervalMsg;

    /**
     * Creates a plain object from an IdentifierIntervalMsg message. Also converts values to other types if specified.
     * @param message IdentifierIntervalMsg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: IdentifierIntervalMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this IdentifierIntervalMsg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a QuerySync. */
export interface IQuerySync {

    /** QuerySync vector */
    vector?: { [k: string]: number };
}

/** Represents a QuerySync. */
export class QuerySync {

    /**
     * Constructs a new QuerySync.
     * @param [properties] Properties to set
     */
    constructor(properties?: IQuerySync);

    /** QuerySync vector. */
    public vector: { [k: string]: number };

    /**
     * Creates a new QuerySync instance using the specified properties.
     * @param [properties] Properties to set
     * @returns QuerySync instance
     */
    public static create(properties?: IQuerySync): QuerySync;

    /**
     * Encodes the specified QuerySync message. Does not implicitly {@link QuerySync.verify|verify} messages.
     * @param message QuerySync message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IQuerySync, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified QuerySync message, length delimited. Does not implicitly {@link QuerySync.verify|verify} messages.
     * @param message QuerySync message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IQuerySync, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a QuerySync message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns QuerySync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): QuerySync;

    /**
     * Decodes a QuerySync message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns QuerySync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): QuerySync;

    /**
     * Verifies a QuerySync message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a QuerySync message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns QuerySync
     */
    public static fromObject(object: { [k: string]: any }): QuerySync;

    /**
     * Creates a plain object from a QuerySync message. Also converts values to other types if specified.
     * @param message QuerySync
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: QuerySync, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this QuerySync to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ReplySync. */
export interface IReplySync {

    /** ReplySync richLogootSOpsMsg */
    richLogootSOpsMsg?: IRichLogootSOperationMsg[];

    /** ReplySync intervals */
    intervals?: IIntervalMsg[];
}

/** Represents a ReplySync. */
export class ReplySync {

    /**
     * Constructs a new ReplySync.
     * @param [properties] Properties to set
     */
    constructor(properties?: IReplySync);

    /** ReplySync richLogootSOpsMsg. */
    public richLogootSOpsMsg: IRichLogootSOperationMsg[];

    /** ReplySync intervals. */
    public intervals: IIntervalMsg[];

    /**
     * Creates a new ReplySync instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ReplySync instance
     */
    public static create(properties?: IReplySync): ReplySync;

    /**
     * Encodes the specified ReplySync message. Does not implicitly {@link ReplySync.verify|verify} messages.
     * @param message ReplySync message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IReplySync, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ReplySync message, length delimited. Does not implicitly {@link ReplySync.verify|verify} messages.
     * @param message ReplySync message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IReplySync, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ReplySync message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ReplySync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ReplySync;

    /**
     * Decodes a ReplySync message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ReplySync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ReplySync;

    /**
     * Verifies a ReplySync message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ReplySync message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ReplySync
     */
    public static fromObject(object: { [k: string]: any }): ReplySync;

    /**
     * Creates a plain object from a ReplySync message. Also converts values to other types if specified.
     * @param message ReplySync
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ReplySync, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ReplySync to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an IntervalMsg. */
export interface IIntervalMsg {

    /** IntervalMsg id */
    id?: number;

    /** IntervalMsg begin */
    begin?: number;

    /** IntervalMsg end */
    end?: number;
}

/** Represents an IntervalMsg. */
export class IntervalMsg {

    /**
     * Constructs a new IntervalMsg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IIntervalMsg);

    /** IntervalMsg id. */
    public id: number;

    /** IntervalMsg begin. */
    public begin: number;

    /** IntervalMsg end. */
    public end: number;

    /**
     * Creates a new IntervalMsg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns IntervalMsg instance
     */
    public static create(properties?: IIntervalMsg): IntervalMsg;

    /**
     * Encodes the specified IntervalMsg message. Does not implicitly {@link IntervalMsg.verify|verify} messages.
     * @param message IntervalMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IIntervalMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified IntervalMsg message, length delimited. Does not implicitly {@link IntervalMsg.verify|verify} messages.
     * @param message IntervalMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IIntervalMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an IntervalMsg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns IntervalMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): IntervalMsg;

    /**
     * Decodes an IntervalMsg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns IntervalMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): IntervalMsg;

    /**
     * Verifies an IntervalMsg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an IntervalMsg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns IntervalMsg
     */
    public static fromObject(object: { [k: string]: any }): IntervalMsg;

    /**
     * Creates a plain object from an IntervalMsg message. Also converts values to other types if specified.
     * @param message IntervalMsg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: IntervalMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this IntervalMsg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

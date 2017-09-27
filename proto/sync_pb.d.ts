import * as $protobuf from "protobufjs";

/** Namespace sync. */
export namespace sync {

    /** Properties of a SyncMsg. */
    interface ISyncMsg {

        /** SyncMsg richLogootSOpMsg */
        richLogootSOpMsg?: sync.IRichLogootSOperationMsg;

        /** SyncMsg querySync */
        querySync?: sync.IQuerySync;

        /** SyncMsg replySync */
        replySync?: sync.IReplySync;
    }

    /** Represents a SyncMsg. */
    class SyncMsg {

        /**
         * Constructs a new SyncMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.ISyncMsg);

        /** SyncMsg richLogootSOpMsg. */
        public richLogootSOpMsg?: (sync.IRichLogootSOperationMsg|null);

        /** SyncMsg querySync. */
        public querySync?: (sync.IQuerySync|null);

        /** SyncMsg replySync. */
        public replySync?: (sync.IReplySync|null);

        /** SyncMsg type. */
        public type?: string;

        /**
         * Creates a new SyncMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncMsg instance
         */
        public static create(properties?: sync.ISyncMsg): sync.SyncMsg;

        /**
         * Encodes the specified SyncMsg message. Does not implicitly {@link sync.SyncMsg.verify|verify} messages.
         * @param message SyncMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.ISyncMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.SyncMsg;
    }

    /** Properties of a RichLogootSOperationMsg. */
    interface IRichLogootSOperationMsg {

        /** RichLogootSOperationMsg id */
        id?: number;

        /** RichLogootSOperationMsg clock */
        clock?: number;

        /** RichLogootSOperationMsg logootSAddMsg */
        logootSAddMsg?: sync.ILogootSAddMsg;

        /** RichLogootSOperationMsg logootSDelMsg */
        logootSDelMsg?: sync.ILogootSDelMsg;
    }

    /** Represents a RichLogootSOperationMsg. */
    class RichLogootSOperationMsg {

        /**
         * Constructs a new RichLogootSOperationMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IRichLogootSOperationMsg);

        /** RichLogootSOperationMsg id. */
        public id: number;

        /** RichLogootSOperationMsg clock. */
        public clock: number;

        /** RichLogootSOperationMsg logootSAddMsg. */
        public logootSAddMsg?: (sync.ILogootSAddMsg|null);

        /** RichLogootSOperationMsg logootSDelMsg. */
        public logootSDelMsg?: (sync.ILogootSDelMsg|null);

        /** RichLogootSOperationMsg type. */
        public type?: string;

        /**
         * Creates a new RichLogootSOperationMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RichLogootSOperationMsg instance
         */
        public static create(properties?: sync.IRichLogootSOperationMsg): sync.RichLogootSOperationMsg;

        /**
         * Encodes the specified RichLogootSOperationMsg message. Does not implicitly {@link sync.RichLogootSOperationMsg.verify|verify} messages.
         * @param message RichLogootSOperationMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IRichLogootSOperationMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RichLogootSOperationMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RichLogootSOperationMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.RichLogootSOperationMsg;
    }

    /** Properties of a LogootSAddMsg. */
    interface ILogootSAddMsg {

        /** LogootSAddMsg id */
        id?: sync.IIdentifierMsg;

        /** LogootSAddMsg content */
        content?: string;
    }

    /** Represents a LogootSAddMsg. */
    class LogootSAddMsg {

        /**
         * Constructs a new LogootSAddMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.ILogootSAddMsg);

        /** LogootSAddMsg id. */
        public id?: (sync.IIdentifierMsg|null);

        /** LogootSAddMsg content. */
        public content: string;

        /**
         * Creates a new LogootSAddMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LogootSAddMsg instance
         */
        public static create(properties?: sync.ILogootSAddMsg): sync.LogootSAddMsg;

        /**
         * Encodes the specified LogootSAddMsg message. Does not implicitly {@link sync.LogootSAddMsg.verify|verify} messages.
         * @param message LogootSAddMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.ILogootSAddMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LogootSAddMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LogootSAddMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.LogootSAddMsg;
    }

    /** Properties of an IdentifierMsg. */
    interface IIdentifierMsg {

        /** IdentifierMsg base */
        base?: number[];

        /** IdentifierMsg last */
        last?: number;
    }

    /** Represents an IdentifierMsg. */
    class IdentifierMsg {

        /**
         * Constructs a new IdentifierMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IIdentifierMsg);

        /** IdentifierMsg base. */
        public base: number[];

        /** IdentifierMsg last. */
        public last: number;

        /**
         * Creates a new IdentifierMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns IdentifierMsg instance
         */
        public static create(properties?: sync.IIdentifierMsg): sync.IdentifierMsg;

        /**
         * Encodes the specified IdentifierMsg message. Does not implicitly {@link sync.IdentifierMsg.verify|verify} messages.
         * @param message IdentifierMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IIdentifierMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an IdentifierMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns IdentifierMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.IdentifierMsg;
    }

    /** Properties of a LogootSDelMsg. */
    interface ILogootSDelMsg {

        /** LogootSDelMsg lid */
        lid?: sync.IIdentifierIntervalMsg[];
    }

    /** Represents a LogootSDelMsg. */
    class LogootSDelMsg {

        /**
         * Constructs a new LogootSDelMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.ILogootSDelMsg);

        /** LogootSDelMsg lid. */
        public lid: sync.IIdentifierIntervalMsg[];

        /**
         * Creates a new LogootSDelMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LogootSDelMsg instance
         */
        public static create(properties?: sync.ILogootSDelMsg): sync.LogootSDelMsg;

        /**
         * Encodes the specified LogootSDelMsg message. Does not implicitly {@link sync.LogootSDelMsg.verify|verify} messages.
         * @param message LogootSDelMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.ILogootSDelMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LogootSDelMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LogootSDelMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.LogootSDelMsg;
    }

    /** Properties of an IdentifierIntervalMsg. */
    interface IIdentifierIntervalMsg {

        /** IdentifierIntervalMsg base */
        base?: number[];

        /** IdentifierIntervalMsg begin */
        begin?: number;

        /** IdentifierIntervalMsg end */
        end?: number;
    }

    /** Represents an IdentifierIntervalMsg. */
    class IdentifierIntervalMsg {

        /**
         * Constructs a new IdentifierIntervalMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IIdentifierIntervalMsg);

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
        public static create(properties?: sync.IIdentifierIntervalMsg): sync.IdentifierIntervalMsg;

        /**
         * Encodes the specified IdentifierIntervalMsg message. Does not implicitly {@link sync.IdentifierIntervalMsg.verify|verify} messages.
         * @param message IdentifierIntervalMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IIdentifierIntervalMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an IdentifierIntervalMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns IdentifierIntervalMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.IdentifierIntervalMsg;
    }

    /** Properties of a QuerySync. */
    interface IQuerySync {

        /** QuerySync vector */
        vector?: { [k: string]: number };
    }

    /** Represents a QuerySync. */
    class QuerySync {

        /**
         * Constructs a new QuerySync.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IQuerySync);

        /** QuerySync vector. */
        public vector: { [k: string]: number };

        /**
         * Creates a new QuerySync instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuerySync instance
         */
        public static create(properties?: sync.IQuerySync): sync.QuerySync;

        /**
         * Encodes the specified QuerySync message. Does not implicitly {@link sync.QuerySync.verify|verify} messages.
         * @param message QuerySync message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IQuerySync, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuerySync message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuerySync
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.QuerySync;
    }

    /** Properties of a ReplySync. */
    interface IReplySync {

        /** ReplySync richLogootSOpsMsg */
        richLogootSOpsMsg?: sync.IRichLogootSOperationMsg[];

        /** ReplySync intervals */
        intervals?: sync.IIntervalMsg[];
    }

    /** Represents a ReplySync. */
    class ReplySync {

        /**
         * Constructs a new ReplySync.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IReplySync);

        /** ReplySync richLogootSOpsMsg. */
        public richLogootSOpsMsg: sync.IRichLogootSOperationMsg[];

        /** ReplySync intervals. */
        public intervals: sync.IIntervalMsg[];

        /**
         * Creates a new ReplySync instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReplySync instance
         */
        public static create(properties?: sync.IReplySync): sync.ReplySync;

        /**
         * Encodes the specified ReplySync message. Does not implicitly {@link sync.ReplySync.verify|verify} messages.
         * @param message ReplySync message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IReplySync, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReplySync message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReplySync
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.ReplySync;
    }

    /** Properties of an IntervalMsg. */
    interface IIntervalMsg {

        /** IntervalMsg id */
        id?: number;

        /** IntervalMsg begin */
        begin?: number;

        /** IntervalMsg end */
        end?: number;
    }

    /** Represents an IntervalMsg. */
    class IntervalMsg {

        /**
         * Constructs a new IntervalMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IIntervalMsg);

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
        public static create(properties?: sync.IIntervalMsg): sync.IntervalMsg;

        /**
         * Encodes the specified IntervalMsg message. Does not implicitly {@link sync.IntervalMsg.verify|verify} messages.
         * @param message IntervalMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IIntervalMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an IntervalMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns IntervalMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.IntervalMsg;
    }
}

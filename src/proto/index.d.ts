import * as $protobuf from "protobufjs";
/** Namespace sync. */
export namespace sync {

    /** Properties of a RichOperationMsg. */
    interface IRichOperationMsg {

        /** RichOperationMsg richLogootSOpsMsg */
        richLogootSOpsMsg?: (sync.IRichLogootSOperationMsg|null);

        /** RichOperationMsg richDottedLogootsOpsMsg */
        richDottedLogootsOpsMsg?: (sync.IRichDottedLogootSOperationMsg|null);
    }

    /** Represents a RichOperationMsg. */
    class RichOperationMsg implements IRichOperationMsg {

        /**
         * Constructs a new RichOperationMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IRichOperationMsg);

        /** RichOperationMsg richLogootSOpsMsg. */
        public richLogootSOpsMsg?: (sync.IRichLogootSOperationMsg|null);

        /** RichOperationMsg richDottedLogootsOpsMsg. */
        public richDottedLogootsOpsMsg?: (sync.IRichDottedLogootSOperationMsg|null);

        /** RichOperationMsg type. */
        public type?: ("richLogootSOpsMsg"|"richDottedLogootsOpsMsg");

        /**
         * Creates a new RichOperationMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RichOperationMsg instance
         */
        public static create(properties?: sync.IRichOperationMsg): sync.RichOperationMsg;

        /**
         * Encodes the specified RichOperationMsg message. Does not implicitly {@link sync.RichOperationMsg.verify|verify} messages.
         * @param message RichOperationMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IRichOperationMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RichOperationMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RichOperationMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.RichOperationMsg;
    }

    /** Properties of a SyncMsg. */
    interface ISyncMsg {

        /** SyncMsg richOpMsg */
        richOpMsg?: (sync.IRichOperationMsg|null);

        /** SyncMsg querySync */
        querySync?: (sync.IQuerySyncMsg|null);

        /** SyncMsg replySync */
        replySync?: (sync.IReplySyncMsg|null);
    }

    /** Represents a SyncMsg. */
    class SyncMsg implements ISyncMsg {

        /**
         * Constructs a new SyncMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.ISyncMsg);

        /** SyncMsg richOpMsg. */
        public richOpMsg?: (sync.IRichOperationMsg|null);

        /** SyncMsg querySync. */
        public querySync?: (sync.IQuerySyncMsg|null);

        /** SyncMsg replySync. */
        public replySync?: (sync.IReplySyncMsg|null);

        /** SyncMsg type. */
        public type?: ("richOpMsg"|"querySync"|"replySync");

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

    /** Properties of a QuerySyncMsg. */
    interface IQuerySyncMsg {

        /** QuerySyncMsg vector */
        vector?: ({ [k: string]: number }|null);
    }

    /** Represents a QuerySyncMsg. */
    class QuerySyncMsg implements IQuerySyncMsg {

        /**
         * Constructs a new QuerySyncMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IQuerySyncMsg);

        /** QuerySyncMsg vector. */
        public vector: { [k: string]: number };

        /**
         * Creates a new QuerySyncMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuerySyncMsg instance
         */
        public static create(properties?: sync.IQuerySyncMsg): sync.QuerySyncMsg;

        /**
         * Encodes the specified QuerySyncMsg message. Does not implicitly {@link sync.QuerySyncMsg.verify|verify} messages.
         * @param message QuerySyncMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IQuerySyncMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuerySyncMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuerySyncMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.QuerySyncMsg;
    }

    /** Properties of a ReplySyncMsg. */
    interface IReplySyncMsg {

        /** ReplySyncMsg richOpsMsg */
        richOpsMsg?: (sync.IRichOperationMsg[]|null);

        /** ReplySyncMsg intervals */
        intervals?: (sync.IIntervalMsg[]|null);
    }

    /** Represents a ReplySyncMsg. */
    class ReplySyncMsg implements IReplySyncMsg {

        /**
         * Constructs a new ReplySyncMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IReplySyncMsg);

        /** ReplySyncMsg richOpsMsg. */
        public richOpsMsg: sync.IRichOperationMsg[];

        /** ReplySyncMsg intervals. */
        public intervals: sync.IIntervalMsg[];

        /**
         * Creates a new ReplySyncMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReplySyncMsg instance
         */
        public static create(properties?: sync.IReplySyncMsg): sync.ReplySyncMsg;

        /**
         * Encodes the specified ReplySyncMsg message. Does not implicitly {@link sync.ReplySyncMsg.verify|verify} messages.
         * @param message ReplySyncMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IReplySyncMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReplySyncMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReplySyncMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.ReplySyncMsg;
    }

    /** Properties of an IdentifierMsg. */
    interface IIdentifierMsg {

        /** IdentifierMsg tuples */
        tuples?: (sync.IIdentifierTupleMsg[]|null);
    }

    /** Represents an IdentifierMsg. */
    class IdentifierMsg implements IIdentifierMsg {

        /**
         * Constructs a new IdentifierMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IIdentifierMsg);

        /** IdentifierMsg tuples. */
        public tuples: sync.IIdentifierTupleMsg[];

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

    /** Properties of an IdentifierTupleMsg. */
    interface IIdentifierTupleMsg {

        /** IdentifierTupleMsg random */
        random?: (number|null);

        /** IdentifierTupleMsg replicaNumber */
        replicaNumber?: (number|null);

        /** IdentifierTupleMsg clock */
        clock?: (number|null);

        /** IdentifierTupleMsg offset */
        offset?: (number|null);
    }

    /** Represents an IdentifierTupleMsg. */
    class IdentifierTupleMsg implements IIdentifierTupleMsg {

        /**
         * Constructs a new IdentifierTupleMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IIdentifierTupleMsg);

        /** IdentifierTupleMsg random. */
        public random: number;

        /** IdentifierTupleMsg replicaNumber. */
        public replicaNumber: number;

        /** IdentifierTupleMsg clock. */
        public clock: number;

        /** IdentifierTupleMsg offset. */
        public offset: number;

        /**
         * Creates a new IdentifierTupleMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns IdentifierTupleMsg instance
         */
        public static create(properties?: sync.IIdentifierTupleMsg): sync.IdentifierTupleMsg;

        /**
         * Encodes the specified IdentifierTupleMsg message. Does not implicitly {@link sync.IdentifierTupleMsg.verify|verify} messages.
         * @param message IdentifierTupleMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IIdentifierTupleMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an IdentifierTupleMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns IdentifierTupleMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.IdentifierTupleMsg;
    }

    /** Properties of an IdentifierIntervalMsg. */
    interface IIdentifierIntervalMsg {

        /** IdentifierIntervalMsg idBegin */
        idBegin?: (sync.IIdentifierMsg|null);

        /** IdentifierIntervalMsg end */
        end?: (number|null);
    }

    /** Represents an IdentifierIntervalMsg. */
    class IdentifierIntervalMsg implements IIdentifierIntervalMsg {

        /**
         * Constructs a new IdentifierIntervalMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IIdentifierIntervalMsg);

        /** IdentifierIntervalMsg idBegin. */
        public idBegin?: (sync.IIdentifierMsg|null);

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

    /** Properties of an IntervalMsg. */
    interface IIntervalMsg {

        /** IntervalMsg id */
        id?: (number|null);

        /** IntervalMsg begin */
        begin?: (number|null);

        /** IntervalMsg end */
        end?: (number|null);
    }

    /** Represents an IntervalMsg. */
    class IntervalMsg implements IIntervalMsg {

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

    /** Properties of a RichLogootSOperationMsg. */
    interface IRichLogootSOperationMsg {

        /** RichLogootSOperationMsg id */
        id?: (number|null);

        /** RichLogootSOperationMsg clock */
        clock?: (number|null);

        /** RichLogootSOperationMsg logootSAddMsg */
        logootSAddMsg?: (sync.ILogootSAddMsg|null);

        /** RichLogootSOperationMsg logootSDelMsg */
        logootSDelMsg?: (sync.ILogootSDelMsg|null);

        /** RichLogootSOperationMsg dependencies */
        dependencies?: ({ [k: string]: number }|null);
    }

    /** Represents a RichLogootSOperationMsg. */
    class RichLogootSOperationMsg implements IRichLogootSOperationMsg {

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

        /** RichLogootSOperationMsg dependencies. */
        public dependencies: { [k: string]: number };

        /** RichLogootSOperationMsg type. */
        public type?: ("logootSAddMsg"|"logootSDelMsg");

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
        id?: (sync.IIdentifierMsg|null);

        /** LogootSAddMsg content */
        content?: (string|null);
    }

    /** Represents a LogootSAddMsg. */
    class LogootSAddMsg implements ILogootSAddMsg {

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

    /** Properties of a LogootSDelMsg. */
    interface ILogootSDelMsg {

        /** LogootSDelMsg lid */
        lid?: (sync.IIdentifierIntervalMsg[]|null);

        /** LogootSDelMsg author */
        author?: (number|null);
    }

    /** Represents a LogootSDelMsg. */
    class LogootSDelMsg implements ILogootSDelMsg {

        /**
         * Constructs a new LogootSDelMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.ILogootSDelMsg);

        /** LogootSDelMsg lid. */
        public lid: sync.IIdentifierIntervalMsg[];

        /** LogootSDelMsg author. */
        public author: number;

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

    /** Properties of a RichDottedLogootSOperationMsg. */
    interface IRichDottedLogootSOperationMsg {

        /** RichDottedLogootSOperationMsg id */
        id?: (number|null);

        /** RichDottedLogootSOperationMsg clock */
        clock?: (number|null);

        /** RichDottedLogootSOperationMsg blockOperationMsg */
        blockOperationMsg?: (sync.IDottedLogootSBlockMsg|null);

        /** RichDottedLogootSOperationMsg dependencies */
        dependencies?: ({ [k: string]: number }|null);
    }

    /** Represents a RichDottedLogootSOperationMsg. */
    class RichDottedLogootSOperationMsg implements IRichDottedLogootSOperationMsg {

        /**
         * Constructs a new RichDottedLogootSOperationMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IRichDottedLogootSOperationMsg);

        /** RichDottedLogootSOperationMsg id. */
        public id: number;

        /** RichDottedLogootSOperationMsg clock. */
        public clock: number;

        /** RichDottedLogootSOperationMsg blockOperationMsg. */
        public blockOperationMsg?: (sync.IDottedLogootSBlockMsg|null);

        /** RichDottedLogootSOperationMsg dependencies. */
        public dependencies: { [k: string]: number };

        /**
         * Creates a new RichDottedLogootSOperationMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RichDottedLogootSOperationMsg instance
         */
        public static create(properties?: sync.IRichDottedLogootSOperationMsg): sync.RichDottedLogootSOperationMsg;

        /**
         * Encodes the specified RichDottedLogootSOperationMsg message. Does not implicitly {@link sync.RichDottedLogootSOperationMsg.verify|verify} messages.
         * @param message RichDottedLogootSOperationMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IRichDottedLogootSOperationMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RichDottedLogootSOperationMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RichDottedLogootSOperationMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.RichDottedLogootSOperationMsg;
    }

    /** Properties of a DottedLogootSBlockMsg. */
    interface IDottedLogootSBlockMsg {

        /** DottedLogootSBlockMsg lowerPos */
        lowerPos?: (sync.ISimpleDotPos|null);

        /** DottedLogootSBlockMsg content */
        content?: (string|null);

        /** DottedLogootSBlockMsg concatLength */
        concatLength?: (sync.IConcatLength|null);
    }

    /** Represents a DottedLogootSBlockMsg. */
    class DottedLogootSBlockMsg implements IDottedLogootSBlockMsg {

        /**
         * Constructs a new DottedLogootSBlockMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IDottedLogootSBlockMsg);

        /** DottedLogootSBlockMsg lowerPos. */
        public lowerPos?: (sync.ISimpleDotPos|null);

        /** DottedLogootSBlockMsg content. */
        public content: string;

        /** DottedLogootSBlockMsg concatLength. */
        public concatLength?: (sync.IConcatLength|null);

        /** DottedLogootSBlockMsg type. */
        public type?: ("content"|"concatLength");

        /**
         * Creates a new DottedLogootSBlockMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DottedLogootSBlockMsg instance
         */
        public static create(properties?: sync.IDottedLogootSBlockMsg): sync.DottedLogootSBlockMsg;

        /**
         * Encodes the specified DottedLogootSBlockMsg message. Does not implicitly {@link sync.DottedLogootSBlockMsg.verify|verify} messages.
         * @param message DottedLogootSBlockMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IDottedLogootSBlockMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DottedLogootSBlockMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DottedLogootSBlockMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.DottedLogootSBlockMsg;
    }

    /** Properties of a ConcatLength. */
    interface IConcatLength {

        /** ConcatLength length */
        length?: (number|null);
    }

    /** Represents a ConcatLength. */
    class ConcatLength implements IConcatLength {

        /**
         * Constructs a new ConcatLength.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.IConcatLength);

        /** ConcatLength length. */
        public length: number;

        /**
         * Creates a new ConcatLength instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ConcatLength instance
         */
        public static create(properties?: sync.IConcatLength): sync.ConcatLength;

        /**
         * Encodes the specified ConcatLength message. Does not implicitly {@link sync.ConcatLength.verify|verify} messages.
         * @param message ConcatLength message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.IConcatLength, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ConcatLength message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ConcatLength
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.ConcatLength;
    }

    /** Properties of a SimpleDotPosPart. */
    interface ISimpleDotPosPart {

        /** SimpleDotPosPart priority */
        priority?: (number|null);

        /** SimpleDotPosPart replica */
        replica?: (number|null);

        /** SimpleDotPosPart seq */
        seq?: (number|null);
    }

    /** Represents a SimpleDotPosPart. */
    class SimpleDotPosPart implements ISimpleDotPosPart {

        /**
         * Constructs a new SimpleDotPosPart.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.ISimpleDotPosPart);

        /** SimpleDotPosPart priority. */
        public priority: number;

        /** SimpleDotPosPart replica. */
        public replica: number;

        /** SimpleDotPosPart seq. */
        public seq: number;

        /**
         * Creates a new SimpleDotPosPart instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SimpleDotPosPart instance
         */
        public static create(properties?: sync.ISimpleDotPosPart): sync.SimpleDotPosPart;

        /**
         * Encodes the specified SimpleDotPosPart message. Does not implicitly {@link sync.SimpleDotPosPart.verify|verify} messages.
         * @param message SimpleDotPosPart message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.ISimpleDotPosPart, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SimpleDotPosPart message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SimpleDotPosPart
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.SimpleDotPosPart;
    }

    /** Properties of a SimpleDotPos. */
    interface ISimpleDotPos {

        /** SimpleDotPos parts */
        parts?: (sync.ISimpleDotPosPart[]|null);
    }

    /** Represents a SimpleDotPos. */
    class SimpleDotPos implements ISimpleDotPos {

        /**
         * Constructs a new SimpleDotPos.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.ISimpleDotPos);

        /** SimpleDotPos parts. */
        public parts: sync.ISimpleDotPosPart[];

        /**
         * Creates a new SimpleDotPos instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SimpleDotPos instance
         */
        public static create(properties?: sync.ISimpleDotPos): sync.SimpleDotPos;

        /**
         * Encodes the specified SimpleDotPos message. Does not implicitly {@link sync.SimpleDotPos.verify|verify} messages.
         * @param message SimpleDotPos message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: sync.ISimpleDotPos, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SimpleDotPos message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SimpleDotPos
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.SimpleDotPos;
    }
}

/** Namespace collaborator. */
export namespace collaborator {

    /** Properties of a Collaborator. */
    interface ICollaborator {

        /** Collaborator muteCoreId */
        muteCoreId?: (number|null);

        /** Collaborator displayName */
        displayName?: (string|null);

        /** Collaborator login */
        login?: (string|null);

        /** Collaborator email */
        email?: (string|null);

        /** Collaborator avatar */
        avatar?: (string|null);

        /** Collaborator deviceID */
        deviceID?: (string|null);
    }

    /** Represents a Collaborator. */
    class Collaborator implements ICollaborator {

        /**
         * Constructs a new Collaborator.
         * @param [properties] Properties to set
         */
        constructor(properties?: collaborator.ICollaborator);

        /** Collaborator muteCoreId. */
        public muteCoreId: number;

        /** Collaborator displayName. */
        public displayName: string;

        /** Collaborator login. */
        public login: string;

        /** Collaborator email. */
        public email: string;

        /** Collaborator avatar. */
        public avatar: string;

        /** Collaborator deviceID. */
        public deviceID: string;

        /**
         * Creates a new Collaborator instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Collaborator instance
         */
        public static create(properties?: collaborator.ICollaborator): collaborator.Collaborator;

        /**
         * Encodes the specified Collaborator message. Does not implicitly {@link collaborator.Collaborator.verify|verify} messages.
         * @param message Collaborator message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: collaborator.ICollaborator, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Collaborator message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Collaborator
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): collaborator.Collaborator;
    }

    /** Properties of a SwimPG. */
    interface ISwimPG {

        /** SwimPG message */
        message: number;

        /** SwimPG collab */
        collab: collaborator.ICollaborator;

        /** SwimPG incarn */
        incarn: number;
    }

    /** Represents a SwimPG. */
    class SwimPG implements ISwimPG {

        /**
         * Constructs a new SwimPG.
         * @param [properties] Properties to set
         */
        constructor(properties?: collaborator.ISwimPG);

        /** SwimPG message. */
        public message: number;

        /** SwimPG collab. */
        public collab: collaborator.ICollaborator;

        /** SwimPG incarn. */
        public incarn: number;

        /**
         * Creates a new SwimPG instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwimPG instance
         */
        public static create(properties?: collaborator.ISwimPG): collaborator.SwimPG;

        /**
         * Encodes the specified SwimPG message. Does not implicitly {@link collaborator.SwimPG.verify|verify} messages.
         * @param message SwimPG message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: collaborator.ISwimPG, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwimPG message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwimPG
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): collaborator.SwimPG;
    }

    /** Properties of a SwimPGEntry. */
    interface ISwimPGEntry {

        /** SwimPGEntry id */
        id: number;

        /** SwimPGEntry swimPG */
        swimPG: collaborator.ISwimPG;
    }

    /** Represents a SwimPGEntry. */
    class SwimPGEntry implements ISwimPGEntry {

        /**
         * Constructs a new SwimPGEntry.
         * @param [properties] Properties to set
         */
        constructor(properties?: collaborator.ISwimPGEntry);

        /** SwimPGEntry id. */
        public id: number;

        /** SwimPGEntry swimPG. */
        public swimPG: collaborator.ISwimPG;

        /**
         * Creates a new SwimPGEntry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwimPGEntry instance
         */
        public static create(properties?: collaborator.ISwimPGEntry): collaborator.SwimPGEntry;

        /**
         * Encodes the specified SwimPGEntry message. Does not implicitly {@link collaborator.SwimPGEntry.verify|verify} messages.
         * @param message SwimPGEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: collaborator.ISwimPGEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwimPGEntry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwimPGEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): collaborator.SwimPGEntry;
    }

    /** Properties of a SwimMsg. */
    interface ISwimMsg {

        /** SwimMsg swimPing */
        swimPing?: (collaborator.ISwimPing|null);

        /** SwimMsg swimPingReq */
        swimPingReq?: (collaborator.ISwimPingReq|null);

        /** SwimMsg swimAck */
        swimAck?: (collaborator.ISwimAck|null);

        /** SwimMsg swimDataRequest */
        swimDataRequest?: (collaborator.ISwimDataRequest|null);

        /** SwimMsg swimDataUpdate */
        swimDataUpdate?: (collaborator.ISwimDataUpdate|null);

        /** SwimMsg swimPingReqRep */
        swimPingReqRep?: (collaborator.ISwimPingReqRep|null);
    }

    /** Represents a SwimMsg. */
    class SwimMsg implements ISwimMsg {

        /**
         * Constructs a new SwimMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: collaborator.ISwimMsg);

        /** SwimMsg swimPing. */
        public swimPing?: (collaborator.ISwimPing|null);

        /** SwimMsg swimPingReq. */
        public swimPingReq?: (collaborator.ISwimPingReq|null);

        /** SwimMsg swimAck. */
        public swimAck?: (collaborator.ISwimAck|null);

        /** SwimMsg swimDataRequest. */
        public swimDataRequest?: (collaborator.ISwimDataRequest|null);

        /** SwimMsg swimDataUpdate. */
        public swimDataUpdate?: (collaborator.ISwimDataUpdate|null);

        /** SwimMsg swimPingReqRep. */
        public swimPingReqRep?: (collaborator.ISwimPingReqRep|null);

        /** SwimMsg type. */
        public type?: ("swimPing"|"swimPingReq"|"swimAck"|"swimDataRequest"|"swimDataUpdate"|"swimPingReqRep");

        /**
         * Creates a new SwimMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwimMsg instance
         */
        public static create(properties?: collaborator.ISwimMsg): collaborator.SwimMsg;

        /**
         * Encodes the specified SwimMsg message. Does not implicitly {@link collaborator.SwimMsg.verify|verify} messages.
         * @param message SwimMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: collaborator.ISwimMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwimMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwimMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): collaborator.SwimMsg;
    }

    /** Properties of a SwimPing. */
    interface ISwimPing {

        /** SwimPing type */
        type?: (string|null);

        /** SwimPing piggyback */
        piggyback?: (collaborator.ISwimPGEntry[]|null);
    }

    /** Represents a SwimPing. */
    class SwimPing implements ISwimPing {

        /**
         * Constructs a new SwimPing.
         * @param [properties] Properties to set
         */
        constructor(properties?: collaborator.ISwimPing);

        /** SwimPing type. */
        public type: string;

        /** SwimPing piggyback. */
        public piggyback: collaborator.ISwimPGEntry[];

        /**
         * Creates a new SwimPing instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwimPing instance
         */
        public static create(properties?: collaborator.ISwimPing): collaborator.SwimPing;

        /**
         * Encodes the specified SwimPing message. Does not implicitly {@link collaborator.SwimPing.verify|verify} messages.
         * @param message SwimPing message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: collaborator.ISwimPing, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwimPing message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwimPing
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): collaborator.SwimPing;
    }

    /** Properties of a SwimPingReq. */
    interface ISwimPingReq {

        /** SwimPingReq type */
        type?: (string|null);

        /** SwimPingReq numTarget */
        numTarget?: (number|null);

        /** SwimPingReq piggyback */
        piggyback?: (collaborator.ISwimPGEntry[]|null);
    }

    /** Represents a SwimPingReq. */
    class SwimPingReq implements ISwimPingReq {

        /**
         * Constructs a new SwimPingReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: collaborator.ISwimPingReq);

        /** SwimPingReq type. */
        public type: string;

        /** SwimPingReq numTarget. */
        public numTarget: number;

        /** SwimPingReq piggyback. */
        public piggyback: collaborator.ISwimPGEntry[];

        /**
         * Creates a new SwimPingReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwimPingReq instance
         */
        public static create(properties?: collaborator.ISwimPingReq): collaborator.SwimPingReq;

        /**
         * Encodes the specified SwimPingReq message. Does not implicitly {@link collaborator.SwimPingReq.verify|verify} messages.
         * @param message SwimPingReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: collaborator.ISwimPingReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwimPingReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwimPingReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): collaborator.SwimPingReq;
    }

    /** Properties of a SwimAck. */
    interface ISwimAck {

        /** SwimAck type */
        type?: (string|null);

        /** SwimAck piggyback */
        piggyback?: (collaborator.ISwimPGEntry[]|null);
    }

    /** Represents a SwimAck. */
    class SwimAck implements ISwimAck {

        /**
         * Constructs a new SwimAck.
         * @param [properties] Properties to set
         */
        constructor(properties?: collaborator.ISwimAck);

        /** SwimAck type. */
        public type: string;

        /** SwimAck piggyback. */
        public piggyback: collaborator.ISwimPGEntry[];

        /**
         * Creates a new SwimAck instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwimAck instance
         */
        public static create(properties?: collaborator.ISwimAck): collaborator.SwimAck;

        /**
         * Encodes the specified SwimAck message. Does not implicitly {@link collaborator.SwimAck.verify|verify} messages.
         * @param message SwimAck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: collaborator.ISwimAck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwimAck message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwimAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): collaborator.SwimAck;
    }

    /** Properties of a SwimDataRequest. */
    interface ISwimDataRequest {

        /** SwimDataRequest type */
        type?: (string|null);

        /** SwimDataRequest collab */
        collab?: (collaborator.ICollaborator|null);

        /** SwimDataRequest incarn */
        incarn?: (number|null);
    }

    /** Represents a SwimDataRequest. */
    class SwimDataRequest implements ISwimDataRequest {

        /**
         * Constructs a new SwimDataRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: collaborator.ISwimDataRequest);

        /** SwimDataRequest type. */
        public type: string;

        /** SwimDataRequest collab. */
        public collab?: (collaborator.ICollaborator|null);

        /** SwimDataRequest incarn. */
        public incarn: number;

        /**
         * Creates a new SwimDataRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwimDataRequest instance
         */
        public static create(properties?: collaborator.ISwimDataRequest): collaborator.SwimDataRequest;

        /**
         * Encodes the specified SwimDataRequest message. Does not implicitly {@link collaborator.SwimDataRequest.verify|verify} messages.
         * @param message SwimDataRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: collaborator.ISwimDataRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwimDataRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwimDataRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): collaborator.SwimDataRequest;
    }

    /** Properties of a SwimDataUpdate. */
    interface ISwimDataUpdate {

        /** SwimDataUpdate type */
        type?: (string|null);

        /** SwimDataUpdate PG */
        PG?: (collaborator.ISwimPGEntry[]|null);

        /** SwimDataUpdate compteurPG */
        compteurPG?: ({ [k: string]: number }|null);
    }

    /** Represents a SwimDataUpdate. */
    class SwimDataUpdate implements ISwimDataUpdate {

        /**
         * Constructs a new SwimDataUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: collaborator.ISwimDataUpdate);

        /** SwimDataUpdate type. */
        public type: string;

        /** SwimDataUpdate PG. */
        public PG: collaborator.ISwimPGEntry[];

        /** SwimDataUpdate compteurPG. */
        public compteurPG: { [k: string]: number };

        /**
         * Creates a new SwimDataUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwimDataUpdate instance
         */
        public static create(properties?: collaborator.ISwimDataUpdate): collaborator.SwimDataUpdate;

        /**
         * Encodes the specified SwimDataUpdate message. Does not implicitly {@link collaborator.SwimDataUpdate.verify|verify} messages.
         * @param message SwimDataUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: collaborator.ISwimDataUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwimDataUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwimDataUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): collaborator.SwimDataUpdate;
    }

    /** Properties of a SwimPingReqRep. */
    interface ISwimPingReqRep {

        /** SwimPingReqRep type */
        type?: (string|null);

        /** SwimPingReqRep answer */
        answer?: (boolean|null);

        /** SwimPingReqRep piggyback */
        piggyback?: (collaborator.ISwimPGEntry[]|null);
    }

    /** Represents a SwimPingReqRep. */
    class SwimPingReqRep implements ISwimPingReqRep {

        /**
         * Constructs a new SwimPingReqRep.
         * @param [properties] Properties to set
         */
        constructor(properties?: collaborator.ISwimPingReqRep);

        /** SwimPingReqRep type. */
        public type: string;

        /** SwimPingReqRep answer. */
        public answer: boolean;

        /** SwimPingReqRep piggyback. */
        public piggyback: collaborator.ISwimPGEntry[];

        /**
         * Creates a new SwimPingReqRep instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwimPingReqRep instance
         */
        public static create(properties?: collaborator.ISwimPingReqRep): collaborator.SwimPingReqRep;

        /**
         * Encodes the specified SwimPingReqRep message. Does not implicitly {@link collaborator.SwimPingReqRep.verify|verify} messages.
         * @param message SwimPingReqRep message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: collaborator.ISwimPingReqRep, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwimPingReqRep message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwimPingReqRep
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): collaborator.SwimPingReqRep;
    }
}

/** Namespace metadata. */
export namespace metadata {

    /** Properties of a MetaData. */
    interface IMetaData {

        /** MetaData type */
        type?: (number|null);

        /** MetaData data */
        data?: (string|null);
    }

    /** Represents a MetaData. */
    class MetaData implements IMetaData {

        /**
         * Constructs a new MetaData.
         * @param [properties] Properties to set
         */
        constructor(properties?: metadata.IMetaData);

        /** MetaData type. */
        public type: number;

        /** MetaData data. */
        public data: string;

        /**
         * Creates a new MetaData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MetaData instance
         */
        public static create(properties?: metadata.IMetaData): metadata.MetaData;

        /**
         * Encodes the specified MetaData message. Does not implicitly {@link metadata.MetaData.verify|verify} messages.
         * @param message MetaData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: metadata.IMetaData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MetaData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MetaData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): metadata.MetaData;
    }
}

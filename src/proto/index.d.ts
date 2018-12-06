import * as $protobuf from "protobufjs";
/** Namespace sync. */
export namespace sync {

    /** Properties of a RichOperationMsg. */
    interface IRichOperationMsg {

        /** RichOperationMsg richLogootSOpsMsg */
        richLogootSOpsMsg?: (sync.IRichLogootSOperationMsg|null);
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

        /** RichOperationMsg type. */
        public type?: "richLogootSOpsMsg";

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

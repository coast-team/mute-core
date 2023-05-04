/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const sync = $root.sync = (() => {

    /**
     * Namespace sync.
     * @exports sync
     * @namespace
     */
    const sync = {};

    sync.RichOperationMsg = (function() {

        /**
         * Properties of a RichOperationMsg.
         * @memberof sync
         * @interface IRichOperationMsg
         * @property {sync.IRichLogootSOperationMsg|null} [richLogootSOpsMsg] RichOperationMsg richLogootSOpsMsg
         * @property {sync.IRichDottedLogootSOperationMsg|null} [richDottedLogootsOpsMsg] RichOperationMsg richDottedLogootsOpsMsg
         */

        /**
         * Constructs a new RichOperationMsg.
         * @memberof sync
         * @classdesc Represents a RichOperationMsg.
         * @implements IRichOperationMsg
         * @constructor
         * @param {sync.IRichOperationMsg=} [properties] Properties to set
         */
        function RichOperationMsg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RichOperationMsg richLogootSOpsMsg.
         * @member {sync.IRichLogootSOperationMsg|null|undefined} richLogootSOpsMsg
         * @memberof sync.RichOperationMsg
         * @instance
         */
        RichOperationMsg.prototype.richLogootSOpsMsg = null;

        /**
         * RichOperationMsg richDottedLogootsOpsMsg.
         * @member {sync.IRichDottedLogootSOperationMsg|null|undefined} richDottedLogootsOpsMsg
         * @memberof sync.RichOperationMsg
         * @instance
         */
        RichOperationMsg.prototype.richDottedLogootsOpsMsg = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * RichOperationMsg type.
         * @member {"richLogootSOpsMsg"|"richDottedLogootsOpsMsg"|undefined} type
         * @memberof sync.RichOperationMsg
         * @instance
         */
        Object.defineProperty(RichOperationMsg.prototype, "type", {
            get: $util.oneOfGetter($oneOfFields = ["richLogootSOpsMsg", "richDottedLogootsOpsMsg"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new RichOperationMsg instance using the specified properties.
         * @function create
         * @memberof sync.RichOperationMsg
         * @static
         * @param {sync.IRichOperationMsg=} [properties] Properties to set
         * @returns {sync.RichOperationMsg} RichOperationMsg instance
         */
        RichOperationMsg.create = function create(properties) {
            return new RichOperationMsg(properties);
        };

        /**
         * Encodes the specified RichOperationMsg message. Does not implicitly {@link sync.RichOperationMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.RichOperationMsg
         * @static
         * @param {sync.IRichOperationMsg} message RichOperationMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RichOperationMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.richLogootSOpsMsg != null && Object.hasOwnProperty.call(message, "richLogootSOpsMsg"))
                $root.sync.RichLogootSOperationMsg.encode(message.richLogootSOpsMsg, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.richDottedLogootsOpsMsg != null && Object.hasOwnProperty.call(message, "richDottedLogootsOpsMsg"))
                $root.sync.RichDottedLogootSOperationMsg.encode(message.richDottedLogootsOpsMsg, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a RichOperationMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.RichOperationMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.RichOperationMsg} RichOperationMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RichOperationMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.RichOperationMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.richLogootSOpsMsg = $root.sync.RichLogootSOperationMsg.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.richDottedLogootsOpsMsg = $root.sync.RichDottedLogootSOperationMsg.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return RichOperationMsg;
    })();

    sync.SyncMsg = (function() {

        /**
         * Properties of a SyncMsg.
         * @memberof sync
         * @interface ISyncMsg
         * @property {sync.IRichOperationMsg|null} [richOpMsg] SyncMsg richOpMsg
         * @property {sync.IQuerySyncMsg|null} [querySync] SyncMsg querySync
         * @property {sync.IReplySyncMsg|null} [replySync] SyncMsg replySync
         */

        /**
         * Constructs a new SyncMsg.
         * @memberof sync
         * @classdesc Represents a SyncMsg.
         * @implements ISyncMsg
         * @constructor
         * @param {sync.ISyncMsg=} [properties] Properties to set
         */
        function SyncMsg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncMsg richOpMsg.
         * @member {sync.IRichOperationMsg|null|undefined} richOpMsg
         * @memberof sync.SyncMsg
         * @instance
         */
        SyncMsg.prototype.richOpMsg = null;

        /**
         * SyncMsg querySync.
         * @member {sync.IQuerySyncMsg|null|undefined} querySync
         * @memberof sync.SyncMsg
         * @instance
         */
        SyncMsg.prototype.querySync = null;

        /**
         * SyncMsg replySync.
         * @member {sync.IReplySyncMsg|null|undefined} replySync
         * @memberof sync.SyncMsg
         * @instance
         */
        SyncMsg.prototype.replySync = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * SyncMsg type.
         * @member {"richOpMsg"|"querySync"|"replySync"|undefined} type
         * @memberof sync.SyncMsg
         * @instance
         */
        Object.defineProperty(SyncMsg.prototype, "type", {
            get: $util.oneOfGetter($oneOfFields = ["richOpMsg", "querySync", "replySync"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new SyncMsg instance using the specified properties.
         * @function create
         * @memberof sync.SyncMsg
         * @static
         * @param {sync.ISyncMsg=} [properties] Properties to set
         * @returns {sync.SyncMsg} SyncMsg instance
         */
        SyncMsg.create = function create(properties) {
            return new SyncMsg(properties);
        };

        /**
         * Encodes the specified SyncMsg message. Does not implicitly {@link sync.SyncMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.SyncMsg
         * @static
         * @param {sync.ISyncMsg} message SyncMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.richOpMsg != null && Object.hasOwnProperty.call(message, "richOpMsg"))
                $root.sync.RichOperationMsg.encode(message.richOpMsg, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.querySync != null && Object.hasOwnProperty.call(message, "querySync"))
                $root.sync.QuerySyncMsg.encode(message.querySync, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.replySync != null && Object.hasOwnProperty.call(message, "replySync"))
                $root.sync.ReplySyncMsg.encode(message.replySync, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a SyncMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.SyncMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.SyncMsg} SyncMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.SyncMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.richOpMsg = $root.sync.RichOperationMsg.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.querySync = $root.sync.QuerySyncMsg.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.replySync = $root.sync.ReplySyncMsg.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return SyncMsg;
    })();

    sync.QuerySyncMsg = (function() {

        /**
         * Properties of a QuerySyncMsg.
         * @memberof sync
         * @interface IQuerySyncMsg
         * @property {Object.<string,number>|null} [vector] QuerySyncMsg vector
         */

        /**
         * Constructs a new QuerySyncMsg.
         * @memberof sync
         * @classdesc Represents a QuerySyncMsg.
         * @implements IQuerySyncMsg
         * @constructor
         * @param {sync.IQuerySyncMsg=} [properties] Properties to set
         */
        function QuerySyncMsg(properties) {
            this.vector = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QuerySyncMsg vector.
         * @member {Object.<string,number>} vector
         * @memberof sync.QuerySyncMsg
         * @instance
         */
        QuerySyncMsg.prototype.vector = $util.emptyObject;

        /**
         * Creates a new QuerySyncMsg instance using the specified properties.
         * @function create
         * @memberof sync.QuerySyncMsg
         * @static
         * @param {sync.IQuerySyncMsg=} [properties] Properties to set
         * @returns {sync.QuerySyncMsg} QuerySyncMsg instance
         */
        QuerySyncMsg.create = function create(properties) {
            return new QuerySyncMsg(properties);
        };

        /**
         * Encodes the specified QuerySyncMsg message. Does not implicitly {@link sync.QuerySyncMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.QuerySyncMsg
         * @static
         * @param {sync.IQuerySyncMsg} message QuerySyncMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuerySyncMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.vector != null && Object.hasOwnProperty.call(message, "vector"))
                for (let keys = Object.keys(message.vector), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 0 =*/8).int32(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.vector[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Decodes a QuerySyncMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.QuerySyncMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.QuerySyncMsg} QuerySyncMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuerySyncMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.QuerySyncMsg(), key, value;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (message.vector === $util.emptyObject)
                        message.vector = {};
                    let end2 = reader.uint32() + reader.pos;
                    key = 0;
                    value = 0;
                    while (reader.pos < end2) {
                        let tag2 = reader.uint32();
                        switch (tag2 >>> 3) {
                        case 1:
                            key = reader.int32();
                            break;
                        case 2:
                            value = reader.int32();
                            break;
                        default:
                            reader.skipType(tag2 & 7);
                            break;
                        }
                    }
                    message.vector[key] = value;
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return QuerySyncMsg;
    })();

    sync.ReplySyncMsg = (function() {

        /**
         * Properties of a ReplySyncMsg.
         * @memberof sync
         * @interface IReplySyncMsg
         * @property {Array.<sync.IRichOperationMsg>|null} [richOpsMsg] ReplySyncMsg richOpsMsg
         * @property {Array.<sync.IIntervalMsg>|null} [intervals] ReplySyncMsg intervals
         */

        /**
         * Constructs a new ReplySyncMsg.
         * @memberof sync
         * @classdesc Represents a ReplySyncMsg.
         * @implements IReplySyncMsg
         * @constructor
         * @param {sync.IReplySyncMsg=} [properties] Properties to set
         */
        function ReplySyncMsg(properties) {
            this.richOpsMsg = [];
            this.intervals = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ReplySyncMsg richOpsMsg.
         * @member {Array.<sync.IRichOperationMsg>} richOpsMsg
         * @memberof sync.ReplySyncMsg
         * @instance
         */
        ReplySyncMsg.prototype.richOpsMsg = $util.emptyArray;

        /**
         * ReplySyncMsg intervals.
         * @member {Array.<sync.IIntervalMsg>} intervals
         * @memberof sync.ReplySyncMsg
         * @instance
         */
        ReplySyncMsg.prototype.intervals = $util.emptyArray;

        /**
         * Creates a new ReplySyncMsg instance using the specified properties.
         * @function create
         * @memberof sync.ReplySyncMsg
         * @static
         * @param {sync.IReplySyncMsg=} [properties] Properties to set
         * @returns {sync.ReplySyncMsg} ReplySyncMsg instance
         */
        ReplySyncMsg.create = function create(properties) {
            return new ReplySyncMsg(properties);
        };

        /**
         * Encodes the specified ReplySyncMsg message. Does not implicitly {@link sync.ReplySyncMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.ReplySyncMsg
         * @static
         * @param {sync.IReplySyncMsg} message ReplySyncMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReplySyncMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.richOpsMsg != null && message.richOpsMsg.length)
                for (let i = 0; i < message.richOpsMsg.length; ++i)
                    $root.sync.RichOperationMsg.encode(message.richOpsMsg[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.intervals != null && message.intervals.length)
                for (let i = 0; i < message.intervals.length; ++i)
                    $root.sync.IntervalMsg.encode(message.intervals[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a ReplySyncMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.ReplySyncMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.ReplySyncMsg} ReplySyncMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReplySyncMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.ReplySyncMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.richOpsMsg && message.richOpsMsg.length))
                        message.richOpsMsg = [];
                    message.richOpsMsg.push($root.sync.RichOperationMsg.decode(reader, reader.uint32()));
                    break;
                case 2:
                    if (!(message.intervals && message.intervals.length))
                        message.intervals = [];
                    message.intervals.push($root.sync.IntervalMsg.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return ReplySyncMsg;
    })();

    sync.IdentifierMsg = (function() {

        /**
         * Properties of an IdentifierMsg.
         * @memberof sync
         * @interface IIdentifierMsg
         * @property {Array.<sync.IIdentifierTupleMsg>|null} [tuples] IdentifierMsg tuples
         */

        /**
         * Constructs a new IdentifierMsg.
         * @memberof sync
         * @classdesc Represents an IdentifierMsg.
         * @implements IIdentifierMsg
         * @constructor
         * @param {sync.IIdentifierMsg=} [properties] Properties to set
         */
        function IdentifierMsg(properties) {
            this.tuples = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * IdentifierMsg tuples.
         * @member {Array.<sync.IIdentifierTupleMsg>} tuples
         * @memberof sync.IdentifierMsg
         * @instance
         */
        IdentifierMsg.prototype.tuples = $util.emptyArray;

        /**
         * Creates a new IdentifierMsg instance using the specified properties.
         * @function create
         * @memberof sync.IdentifierMsg
         * @static
         * @param {sync.IIdentifierMsg=} [properties] Properties to set
         * @returns {sync.IdentifierMsg} IdentifierMsg instance
         */
        IdentifierMsg.create = function create(properties) {
            return new IdentifierMsg(properties);
        };

        /**
         * Encodes the specified IdentifierMsg message. Does not implicitly {@link sync.IdentifierMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.IdentifierMsg
         * @static
         * @param {sync.IIdentifierMsg} message IdentifierMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IdentifierMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tuples != null && message.tuples.length)
                for (let i = 0; i < message.tuples.length; ++i)
                    $root.sync.IdentifierTupleMsg.encode(message.tuples[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes an IdentifierMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.IdentifierMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.IdentifierMsg} IdentifierMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IdentifierMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.IdentifierMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.tuples && message.tuples.length))
                        message.tuples = [];
                    message.tuples.push($root.sync.IdentifierTupleMsg.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return IdentifierMsg;
    })();

    sync.IdentifierTupleMsg = (function() {

        /**
         * Properties of an IdentifierTupleMsg.
         * @memberof sync
         * @interface IIdentifierTupleMsg
         * @property {number|null} [random] IdentifierTupleMsg random
         * @property {number|null} [replicaNumber] IdentifierTupleMsg replicaNumber
         * @property {number|null} [clock] IdentifierTupleMsg clock
         * @property {number|null} [offset] IdentifierTupleMsg offset
         */

        /**
         * Constructs a new IdentifierTupleMsg.
         * @memberof sync
         * @classdesc Represents an IdentifierTupleMsg.
         * @implements IIdentifierTupleMsg
         * @constructor
         * @param {sync.IIdentifierTupleMsg=} [properties] Properties to set
         */
        function IdentifierTupleMsg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * IdentifierTupleMsg random.
         * @member {number} random
         * @memberof sync.IdentifierTupleMsg
         * @instance
         */
        IdentifierTupleMsg.prototype.random = 0;

        /**
         * IdentifierTupleMsg replicaNumber.
         * @member {number} replicaNumber
         * @memberof sync.IdentifierTupleMsg
         * @instance
         */
        IdentifierTupleMsg.prototype.replicaNumber = 0;

        /**
         * IdentifierTupleMsg clock.
         * @member {number} clock
         * @memberof sync.IdentifierTupleMsg
         * @instance
         */
        IdentifierTupleMsg.prototype.clock = 0;

        /**
         * IdentifierTupleMsg offset.
         * @member {number} offset
         * @memberof sync.IdentifierTupleMsg
         * @instance
         */
        IdentifierTupleMsg.prototype.offset = 0;

        /**
         * Creates a new IdentifierTupleMsg instance using the specified properties.
         * @function create
         * @memberof sync.IdentifierTupleMsg
         * @static
         * @param {sync.IIdentifierTupleMsg=} [properties] Properties to set
         * @returns {sync.IdentifierTupleMsg} IdentifierTupleMsg instance
         */
        IdentifierTupleMsg.create = function create(properties) {
            return new IdentifierTupleMsg(properties);
        };

        /**
         * Encodes the specified IdentifierTupleMsg message. Does not implicitly {@link sync.IdentifierTupleMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.IdentifierTupleMsg
         * @static
         * @param {sync.IIdentifierTupleMsg} message IdentifierTupleMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IdentifierTupleMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.random != null && Object.hasOwnProperty.call(message, "random"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.random);
            if (message.replicaNumber != null && Object.hasOwnProperty.call(message, "replicaNumber"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.replicaNumber);
            if (message.clock != null && Object.hasOwnProperty.call(message, "clock"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.clock);
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.offset);
            return writer;
        };

        /**
         * Decodes an IdentifierTupleMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.IdentifierTupleMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.IdentifierTupleMsg} IdentifierTupleMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IdentifierTupleMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.IdentifierTupleMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.random = reader.int32();
                    break;
                case 2:
                    message.replicaNumber = reader.int32();
                    break;
                case 3:
                    message.clock = reader.int32();
                    break;
                case 4:
                    message.offset = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return IdentifierTupleMsg;
    })();

    sync.IdentifierIntervalMsg = (function() {

        /**
         * Properties of an IdentifierIntervalMsg.
         * @memberof sync
         * @interface IIdentifierIntervalMsg
         * @property {sync.IIdentifierMsg|null} [idBegin] IdentifierIntervalMsg idBegin
         * @property {number|null} [end] IdentifierIntervalMsg end
         */

        /**
         * Constructs a new IdentifierIntervalMsg.
         * @memberof sync
         * @classdesc Represents an IdentifierIntervalMsg.
         * @implements IIdentifierIntervalMsg
         * @constructor
         * @param {sync.IIdentifierIntervalMsg=} [properties] Properties to set
         */
        function IdentifierIntervalMsg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * IdentifierIntervalMsg idBegin.
         * @member {sync.IIdentifierMsg|null|undefined} idBegin
         * @memberof sync.IdentifierIntervalMsg
         * @instance
         */
        IdentifierIntervalMsg.prototype.idBegin = null;

        /**
         * IdentifierIntervalMsg end.
         * @member {number} end
         * @memberof sync.IdentifierIntervalMsg
         * @instance
         */
        IdentifierIntervalMsg.prototype.end = 0;

        /**
         * Creates a new IdentifierIntervalMsg instance using the specified properties.
         * @function create
         * @memberof sync.IdentifierIntervalMsg
         * @static
         * @param {sync.IIdentifierIntervalMsg=} [properties] Properties to set
         * @returns {sync.IdentifierIntervalMsg} IdentifierIntervalMsg instance
         */
        IdentifierIntervalMsg.create = function create(properties) {
            return new IdentifierIntervalMsg(properties);
        };

        /**
         * Encodes the specified IdentifierIntervalMsg message. Does not implicitly {@link sync.IdentifierIntervalMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.IdentifierIntervalMsg
         * @static
         * @param {sync.IIdentifierIntervalMsg} message IdentifierIntervalMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IdentifierIntervalMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.idBegin != null && Object.hasOwnProperty.call(message, "idBegin"))
                $root.sync.IdentifierMsg.encode(message.idBegin, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.end != null && Object.hasOwnProperty.call(message, "end"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.end);
            return writer;
        };

        /**
         * Decodes an IdentifierIntervalMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.IdentifierIntervalMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.IdentifierIntervalMsg} IdentifierIntervalMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IdentifierIntervalMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.IdentifierIntervalMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.idBegin = $root.sync.IdentifierMsg.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.end = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return IdentifierIntervalMsg;
    })();

    sync.IntervalMsg = (function() {

        /**
         * Properties of an IntervalMsg.
         * @memberof sync
         * @interface IIntervalMsg
         * @property {number|null} [id] IntervalMsg id
         * @property {number|null} [begin] IntervalMsg begin
         * @property {number|null} [end] IntervalMsg end
         */

        /**
         * Constructs a new IntervalMsg.
         * @memberof sync
         * @classdesc Represents an IntervalMsg.
         * @implements IIntervalMsg
         * @constructor
         * @param {sync.IIntervalMsg=} [properties] Properties to set
         */
        function IntervalMsg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * IntervalMsg id.
         * @member {number} id
         * @memberof sync.IntervalMsg
         * @instance
         */
        IntervalMsg.prototype.id = 0;

        /**
         * IntervalMsg begin.
         * @member {number} begin
         * @memberof sync.IntervalMsg
         * @instance
         */
        IntervalMsg.prototype.begin = 0;

        /**
         * IntervalMsg end.
         * @member {number} end
         * @memberof sync.IntervalMsg
         * @instance
         */
        IntervalMsg.prototype.end = 0;

        /**
         * Creates a new IntervalMsg instance using the specified properties.
         * @function create
         * @memberof sync.IntervalMsg
         * @static
         * @param {sync.IIntervalMsg=} [properties] Properties to set
         * @returns {sync.IntervalMsg} IntervalMsg instance
         */
        IntervalMsg.create = function create(properties) {
            return new IntervalMsg(properties);
        };

        /**
         * Encodes the specified IntervalMsg message. Does not implicitly {@link sync.IntervalMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.IntervalMsg
         * @static
         * @param {sync.IIntervalMsg} message IntervalMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IntervalMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.begin != null && Object.hasOwnProperty.call(message, "begin"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.begin);
            if (message.end != null && Object.hasOwnProperty.call(message, "end"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.end);
            return writer;
        };

        /**
         * Decodes an IntervalMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.IntervalMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.IntervalMsg} IntervalMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IntervalMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.IntervalMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.int32();
                    break;
                case 2:
                    message.begin = reader.int32();
                    break;
                case 3:
                    message.end = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return IntervalMsg;
    })();

    sync.RichLogootSOperationMsg = (function() {

        /**
         * Properties of a RichLogootSOperationMsg.
         * @memberof sync
         * @interface IRichLogootSOperationMsg
         * @property {number|null} [id] RichLogootSOperationMsg id
         * @property {number|null} [clock] RichLogootSOperationMsg clock
         * @property {sync.ILogootSAddMsg|null} [logootSAddMsg] RichLogootSOperationMsg logootSAddMsg
         * @property {sync.ILogootSDelMsg|null} [logootSDelMsg] RichLogootSOperationMsg logootSDelMsg
         * @property {Object.<string,number>|null} [dependencies] RichLogootSOperationMsg dependencies
         */

        /**
         * Constructs a new RichLogootSOperationMsg.
         * @memberof sync
         * @classdesc Represents a RichLogootSOperationMsg.
         * @implements IRichLogootSOperationMsg
         * @constructor
         * @param {sync.IRichLogootSOperationMsg=} [properties] Properties to set
         */
        function RichLogootSOperationMsg(properties) {
            this.dependencies = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RichLogootSOperationMsg id.
         * @member {number} id
         * @memberof sync.RichLogootSOperationMsg
         * @instance
         */
        RichLogootSOperationMsg.prototype.id = 0;

        /**
         * RichLogootSOperationMsg clock.
         * @member {number} clock
         * @memberof sync.RichLogootSOperationMsg
         * @instance
         */
        RichLogootSOperationMsg.prototype.clock = 0;

        /**
         * RichLogootSOperationMsg logootSAddMsg.
         * @member {sync.ILogootSAddMsg|null|undefined} logootSAddMsg
         * @memberof sync.RichLogootSOperationMsg
         * @instance
         */
        RichLogootSOperationMsg.prototype.logootSAddMsg = null;

        /**
         * RichLogootSOperationMsg logootSDelMsg.
         * @member {sync.ILogootSDelMsg|null|undefined} logootSDelMsg
         * @memberof sync.RichLogootSOperationMsg
         * @instance
         */
        RichLogootSOperationMsg.prototype.logootSDelMsg = null;

        /**
         * RichLogootSOperationMsg dependencies.
         * @member {Object.<string,number>} dependencies
         * @memberof sync.RichLogootSOperationMsg
         * @instance
         */
        RichLogootSOperationMsg.prototype.dependencies = $util.emptyObject;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * RichLogootSOperationMsg type.
         * @member {"logootSAddMsg"|"logootSDelMsg"|undefined} type
         * @memberof sync.RichLogootSOperationMsg
         * @instance
         */
        Object.defineProperty(RichLogootSOperationMsg.prototype, "type", {
            get: $util.oneOfGetter($oneOfFields = ["logootSAddMsg", "logootSDelMsg"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new RichLogootSOperationMsg instance using the specified properties.
         * @function create
         * @memberof sync.RichLogootSOperationMsg
         * @static
         * @param {sync.IRichLogootSOperationMsg=} [properties] Properties to set
         * @returns {sync.RichLogootSOperationMsg} RichLogootSOperationMsg instance
         */
        RichLogootSOperationMsg.create = function create(properties) {
            return new RichLogootSOperationMsg(properties);
        };

        /**
         * Encodes the specified RichLogootSOperationMsg message. Does not implicitly {@link sync.RichLogootSOperationMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.RichLogootSOperationMsg
         * @static
         * @param {sync.IRichLogootSOperationMsg} message RichLogootSOperationMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RichLogootSOperationMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.clock != null && Object.hasOwnProperty.call(message, "clock"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.clock);
            if (message.logootSAddMsg != null && Object.hasOwnProperty.call(message, "logootSAddMsg"))
                $root.sync.LogootSAddMsg.encode(message.logootSAddMsg, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.logootSDelMsg != null && Object.hasOwnProperty.call(message, "logootSDelMsg"))
                $root.sync.LogootSDelMsg.encode(message.logootSDelMsg, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.dependencies != null && Object.hasOwnProperty.call(message, "dependencies"))
                for (let keys = Object.keys(message.dependencies), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 0 =*/8).int32(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.dependencies[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Decodes a RichLogootSOperationMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.RichLogootSOperationMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.RichLogootSOperationMsg} RichLogootSOperationMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RichLogootSOperationMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.RichLogootSOperationMsg(), key, value;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.int32();
                    break;
                case 2:
                    message.clock = reader.int32();
                    break;
                case 3:
                    message.logootSAddMsg = $root.sync.LogootSAddMsg.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.logootSDelMsg = $root.sync.LogootSDelMsg.decode(reader, reader.uint32());
                    break;
                case 5:
                    if (message.dependencies === $util.emptyObject)
                        message.dependencies = {};
                    let end2 = reader.uint32() + reader.pos;
                    key = 0;
                    value = 0;
                    while (reader.pos < end2) {
                        let tag2 = reader.uint32();
                        switch (tag2 >>> 3) {
                        case 1:
                            key = reader.int32();
                            break;
                        case 2:
                            value = reader.int32();
                            break;
                        default:
                            reader.skipType(tag2 & 7);
                            break;
                        }
                    }
                    message.dependencies[key] = value;
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return RichLogootSOperationMsg;
    })();

    sync.LogootSAddMsg = (function() {

        /**
         * Properties of a LogootSAddMsg.
         * @memberof sync
         * @interface ILogootSAddMsg
         * @property {sync.IIdentifierMsg|null} [id] LogootSAddMsg id
         * @property {string|null} [content] LogootSAddMsg content
         */

        /**
         * Constructs a new LogootSAddMsg.
         * @memberof sync
         * @classdesc Represents a LogootSAddMsg.
         * @implements ILogootSAddMsg
         * @constructor
         * @param {sync.ILogootSAddMsg=} [properties] Properties to set
         */
        function LogootSAddMsg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LogootSAddMsg id.
         * @member {sync.IIdentifierMsg|null|undefined} id
         * @memberof sync.LogootSAddMsg
         * @instance
         */
        LogootSAddMsg.prototype.id = null;

        /**
         * LogootSAddMsg content.
         * @member {string} content
         * @memberof sync.LogootSAddMsg
         * @instance
         */
        LogootSAddMsg.prototype.content = "";

        /**
         * Creates a new LogootSAddMsg instance using the specified properties.
         * @function create
         * @memberof sync.LogootSAddMsg
         * @static
         * @param {sync.ILogootSAddMsg=} [properties] Properties to set
         * @returns {sync.LogootSAddMsg} LogootSAddMsg instance
         */
        LogootSAddMsg.create = function create(properties) {
            return new LogootSAddMsg(properties);
        };

        /**
         * Encodes the specified LogootSAddMsg message. Does not implicitly {@link sync.LogootSAddMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.LogootSAddMsg
         * @static
         * @param {sync.ILogootSAddMsg} message LogootSAddMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogootSAddMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                $root.sync.IdentifierMsg.encode(message.id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.content);
            return writer;
        };

        /**
         * Decodes a LogootSAddMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.LogootSAddMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.LogootSAddMsg} LogootSAddMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogootSAddMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.LogootSAddMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = $root.sync.IdentifierMsg.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.content = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return LogootSAddMsg;
    })();

    sync.LogootSDelMsg = (function() {

        /**
         * Properties of a LogootSDelMsg.
         * @memberof sync
         * @interface ILogootSDelMsg
         * @property {Array.<sync.IIdentifierIntervalMsg>|null} [lid] LogootSDelMsg lid
         * @property {number|null} [author] LogootSDelMsg author
         */

        /**
         * Constructs a new LogootSDelMsg.
         * @memberof sync
         * @classdesc Represents a LogootSDelMsg.
         * @implements ILogootSDelMsg
         * @constructor
         * @param {sync.ILogootSDelMsg=} [properties] Properties to set
         */
        function LogootSDelMsg(properties) {
            this.lid = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LogootSDelMsg lid.
         * @member {Array.<sync.IIdentifierIntervalMsg>} lid
         * @memberof sync.LogootSDelMsg
         * @instance
         */
        LogootSDelMsg.prototype.lid = $util.emptyArray;

        /**
         * LogootSDelMsg author.
         * @member {number} author
         * @memberof sync.LogootSDelMsg
         * @instance
         */
        LogootSDelMsg.prototype.author = 0;

        /**
         * Creates a new LogootSDelMsg instance using the specified properties.
         * @function create
         * @memberof sync.LogootSDelMsg
         * @static
         * @param {sync.ILogootSDelMsg=} [properties] Properties to set
         * @returns {sync.LogootSDelMsg} LogootSDelMsg instance
         */
        LogootSDelMsg.create = function create(properties) {
            return new LogootSDelMsg(properties);
        };

        /**
         * Encodes the specified LogootSDelMsg message. Does not implicitly {@link sync.LogootSDelMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.LogootSDelMsg
         * @static
         * @param {sync.ILogootSDelMsg} message LogootSDelMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogootSDelMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lid != null && message.lid.length)
                for (let i = 0; i < message.lid.length; ++i)
                    $root.sync.IdentifierIntervalMsg.encode(message.lid[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.author != null && Object.hasOwnProperty.call(message, "author"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.author);
            return writer;
        };

        /**
         * Decodes a LogootSDelMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.LogootSDelMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.LogootSDelMsg} LogootSDelMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogootSDelMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.LogootSDelMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.lid && message.lid.length))
                        message.lid = [];
                    message.lid.push($root.sync.IdentifierIntervalMsg.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.author = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return LogootSDelMsg;
    })();

    sync.RichDottedLogootSOperationMsg = (function() {

        /**
         * Properties of a RichDottedLogootSOperationMsg.
         * @memberof sync
         * @interface IRichDottedLogootSOperationMsg
         * @property {number|null} [id] RichDottedLogootSOperationMsg id
         * @property {number|null} [clock] RichDottedLogootSOperationMsg clock
         * @property {sync.IDottedLogootSBlockMsg|null} [blockOperationMsg] RichDottedLogootSOperationMsg blockOperationMsg
         * @property {Object.<string,number>|null} [dependencies] RichDottedLogootSOperationMsg dependencies
         */

        /**
         * Constructs a new RichDottedLogootSOperationMsg.
         * @memberof sync
         * @classdesc Represents a RichDottedLogootSOperationMsg.
         * @implements IRichDottedLogootSOperationMsg
         * @constructor
         * @param {sync.IRichDottedLogootSOperationMsg=} [properties] Properties to set
         */
        function RichDottedLogootSOperationMsg(properties) {
            this.dependencies = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RichDottedLogootSOperationMsg id.
         * @member {number} id
         * @memberof sync.RichDottedLogootSOperationMsg
         * @instance
         */
        RichDottedLogootSOperationMsg.prototype.id = 0;

        /**
         * RichDottedLogootSOperationMsg clock.
         * @member {number} clock
         * @memberof sync.RichDottedLogootSOperationMsg
         * @instance
         */
        RichDottedLogootSOperationMsg.prototype.clock = 0;

        /**
         * RichDottedLogootSOperationMsg blockOperationMsg.
         * @member {sync.IDottedLogootSBlockMsg|null|undefined} blockOperationMsg
         * @memberof sync.RichDottedLogootSOperationMsg
         * @instance
         */
        RichDottedLogootSOperationMsg.prototype.blockOperationMsg = null;

        /**
         * RichDottedLogootSOperationMsg dependencies.
         * @member {Object.<string,number>} dependencies
         * @memberof sync.RichDottedLogootSOperationMsg
         * @instance
         */
        RichDottedLogootSOperationMsg.prototype.dependencies = $util.emptyObject;

        /**
         * Creates a new RichDottedLogootSOperationMsg instance using the specified properties.
         * @function create
         * @memberof sync.RichDottedLogootSOperationMsg
         * @static
         * @param {sync.IRichDottedLogootSOperationMsg=} [properties] Properties to set
         * @returns {sync.RichDottedLogootSOperationMsg} RichDottedLogootSOperationMsg instance
         */
        RichDottedLogootSOperationMsg.create = function create(properties) {
            return new RichDottedLogootSOperationMsg(properties);
        };

        /**
         * Encodes the specified RichDottedLogootSOperationMsg message. Does not implicitly {@link sync.RichDottedLogootSOperationMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.RichDottedLogootSOperationMsg
         * @static
         * @param {sync.IRichDottedLogootSOperationMsg} message RichDottedLogootSOperationMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RichDottedLogootSOperationMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.clock != null && Object.hasOwnProperty.call(message, "clock"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.clock);
            if (message.blockOperationMsg != null && Object.hasOwnProperty.call(message, "blockOperationMsg"))
                $root.sync.DottedLogootSBlockMsg.encode(message.blockOperationMsg, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.dependencies != null && Object.hasOwnProperty.call(message, "dependencies"))
                for (let keys = Object.keys(message.dependencies), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 0 =*/8).int32(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.dependencies[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Decodes a RichDottedLogootSOperationMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.RichDottedLogootSOperationMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.RichDottedLogootSOperationMsg} RichDottedLogootSOperationMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RichDottedLogootSOperationMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.RichDottedLogootSOperationMsg(), key, value;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.int32();
                    break;
                case 2:
                    message.clock = reader.int32();
                    break;
                case 3:
                    message.blockOperationMsg = $root.sync.DottedLogootSBlockMsg.decode(reader, reader.uint32());
                    break;
                case 4:
                    if (message.dependencies === $util.emptyObject)
                        message.dependencies = {};
                    let end2 = reader.uint32() + reader.pos;
                    key = 0;
                    value = 0;
                    while (reader.pos < end2) {
                        let tag2 = reader.uint32();
                        switch (tag2 >>> 3) {
                        case 1:
                            key = reader.int32();
                            break;
                        case 2:
                            value = reader.int32();
                            break;
                        default:
                            reader.skipType(tag2 & 7);
                            break;
                        }
                    }
                    message.dependencies[key] = value;
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return RichDottedLogootSOperationMsg;
    })();

    sync.DottedLogootSBlockMsg = (function() {

        /**
         * Properties of a DottedLogootSBlockMsg.
         * @memberof sync
         * @interface IDottedLogootSBlockMsg
         * @property {sync.ISimpleDotPos|null} [lowerPos] DottedLogootSBlockMsg lowerPos
         * @property {string|null} [content] DottedLogootSBlockMsg content
         * @property {sync.IConcatLength|null} [concatLength] DottedLogootSBlockMsg concatLength
         */

        /**
         * Constructs a new DottedLogootSBlockMsg.
         * @memberof sync
         * @classdesc Represents a DottedLogootSBlockMsg.
         * @implements IDottedLogootSBlockMsg
         * @constructor
         * @param {sync.IDottedLogootSBlockMsg=} [properties] Properties to set
         */
        function DottedLogootSBlockMsg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DottedLogootSBlockMsg lowerPos.
         * @member {sync.ISimpleDotPos|null|undefined} lowerPos
         * @memberof sync.DottedLogootSBlockMsg
         * @instance
         */
        DottedLogootSBlockMsg.prototype.lowerPos = null;

        /**
         * DottedLogootSBlockMsg content.
         * @member {string|null|undefined} content
         * @memberof sync.DottedLogootSBlockMsg
         * @instance
         */
        DottedLogootSBlockMsg.prototype.content = null;

        /**
         * DottedLogootSBlockMsg concatLength.
         * @member {sync.IConcatLength|null|undefined} concatLength
         * @memberof sync.DottedLogootSBlockMsg
         * @instance
         */
        DottedLogootSBlockMsg.prototype.concatLength = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * DottedLogootSBlockMsg type.
         * @member {"content"|"concatLength"|undefined} type
         * @memberof sync.DottedLogootSBlockMsg
         * @instance
         */
        Object.defineProperty(DottedLogootSBlockMsg.prototype, "type", {
            get: $util.oneOfGetter($oneOfFields = ["content", "concatLength"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new DottedLogootSBlockMsg instance using the specified properties.
         * @function create
         * @memberof sync.DottedLogootSBlockMsg
         * @static
         * @param {sync.IDottedLogootSBlockMsg=} [properties] Properties to set
         * @returns {sync.DottedLogootSBlockMsg} DottedLogootSBlockMsg instance
         */
        DottedLogootSBlockMsg.create = function create(properties) {
            return new DottedLogootSBlockMsg(properties);
        };

        /**
         * Encodes the specified DottedLogootSBlockMsg message. Does not implicitly {@link sync.DottedLogootSBlockMsg.verify|verify} messages.
         * @function encode
         * @memberof sync.DottedLogootSBlockMsg
         * @static
         * @param {sync.IDottedLogootSBlockMsg} message DottedLogootSBlockMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DottedLogootSBlockMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lowerPos != null && Object.hasOwnProperty.call(message, "lowerPos"))
                $root.sync.SimpleDotPos.encode(message.lowerPos, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.content);
            if (message.concatLength != null && Object.hasOwnProperty.call(message, "concatLength"))
                $root.sync.ConcatLength.encode(message.concatLength, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a DottedLogootSBlockMsg message from the specified reader or buffer.
         * @function decode
         * @memberof sync.DottedLogootSBlockMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.DottedLogootSBlockMsg} DottedLogootSBlockMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DottedLogootSBlockMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.DottedLogootSBlockMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.lowerPos = $root.sync.SimpleDotPos.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.content = reader.string();
                    break;
                case 3:
                    message.concatLength = $root.sync.ConcatLength.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return DottedLogootSBlockMsg;
    })();

    sync.ConcatLength = (function() {

        /**
         * Properties of a ConcatLength.
         * @memberof sync
         * @interface IConcatLength
         * @property {number|null} [length] ConcatLength length
         */

        /**
         * Constructs a new ConcatLength.
         * @memberof sync
         * @classdesc Represents a ConcatLength.
         * @implements IConcatLength
         * @constructor
         * @param {sync.IConcatLength=} [properties] Properties to set
         */
        function ConcatLength(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ConcatLength length.
         * @member {number} length
         * @memberof sync.ConcatLength
         * @instance
         */
        ConcatLength.prototype.length = 0;

        /**
         * Creates a new ConcatLength instance using the specified properties.
         * @function create
         * @memberof sync.ConcatLength
         * @static
         * @param {sync.IConcatLength=} [properties] Properties to set
         * @returns {sync.ConcatLength} ConcatLength instance
         */
        ConcatLength.create = function create(properties) {
            return new ConcatLength(properties);
        };

        /**
         * Encodes the specified ConcatLength message. Does not implicitly {@link sync.ConcatLength.verify|verify} messages.
         * @function encode
         * @memberof sync.ConcatLength
         * @static
         * @param {sync.IConcatLength} message ConcatLength message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConcatLength.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.length != null && Object.hasOwnProperty.call(message, "length"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.length);
            return writer;
        };

        /**
         * Decodes a ConcatLength message from the specified reader or buffer.
         * @function decode
         * @memberof sync.ConcatLength
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.ConcatLength} ConcatLength
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConcatLength.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.ConcatLength();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.length = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return ConcatLength;
    })();

    sync.SimpleDotPosPart = (function() {

        /**
         * Properties of a SimpleDotPosPart.
         * @memberof sync
         * @interface ISimpleDotPosPart
         * @property {number|null} [priority] SimpleDotPosPart priority
         * @property {number|null} [replica] SimpleDotPosPart replica
         * @property {number|null} [seq] SimpleDotPosPart seq
         */

        /**
         * Constructs a new SimpleDotPosPart.
         * @memberof sync
         * @classdesc Represents a SimpleDotPosPart.
         * @implements ISimpleDotPosPart
         * @constructor
         * @param {sync.ISimpleDotPosPart=} [properties] Properties to set
         */
        function SimpleDotPosPart(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SimpleDotPosPart priority.
         * @member {number} priority
         * @memberof sync.SimpleDotPosPart
         * @instance
         */
        SimpleDotPosPart.prototype.priority = 0;

        /**
         * SimpleDotPosPart replica.
         * @member {number} replica
         * @memberof sync.SimpleDotPosPart
         * @instance
         */
        SimpleDotPosPart.prototype.replica = 0;

        /**
         * SimpleDotPosPart seq.
         * @member {number} seq
         * @memberof sync.SimpleDotPosPart
         * @instance
         */
        SimpleDotPosPart.prototype.seq = 0;

        /**
         * Creates a new SimpleDotPosPart instance using the specified properties.
         * @function create
         * @memberof sync.SimpleDotPosPart
         * @static
         * @param {sync.ISimpleDotPosPart=} [properties] Properties to set
         * @returns {sync.SimpleDotPosPart} SimpleDotPosPart instance
         */
        SimpleDotPosPart.create = function create(properties) {
            return new SimpleDotPosPart(properties);
        };

        /**
         * Encodes the specified SimpleDotPosPart message. Does not implicitly {@link sync.SimpleDotPosPart.verify|verify} messages.
         * @function encode
         * @memberof sync.SimpleDotPosPart
         * @static
         * @param {sync.ISimpleDotPosPart} message SimpleDotPosPart message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SimpleDotPosPart.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.priority != null && Object.hasOwnProperty.call(message, "priority"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.priority);
            if (message.replica != null && Object.hasOwnProperty.call(message, "replica"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.replica);
            if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.seq);
            return writer;
        };

        /**
         * Decodes a SimpleDotPosPart message from the specified reader or buffer.
         * @function decode
         * @memberof sync.SimpleDotPosPart
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.SimpleDotPosPart} SimpleDotPosPart
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SimpleDotPosPart.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.SimpleDotPosPart();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.priority = reader.uint32();
                    break;
                case 2:
                    message.replica = reader.uint32();
                    break;
                case 3:
                    message.seq = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return SimpleDotPosPart;
    })();

    sync.SimpleDotPos = (function() {

        /**
         * Properties of a SimpleDotPos.
         * @memberof sync
         * @interface ISimpleDotPos
         * @property {Array.<sync.ISimpleDotPosPart>|null} [parts] SimpleDotPos parts
         */

        /**
         * Constructs a new SimpleDotPos.
         * @memberof sync
         * @classdesc Represents a SimpleDotPos.
         * @implements ISimpleDotPos
         * @constructor
         * @param {sync.ISimpleDotPos=} [properties] Properties to set
         */
        function SimpleDotPos(properties) {
            this.parts = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SimpleDotPos parts.
         * @member {Array.<sync.ISimpleDotPosPart>} parts
         * @memberof sync.SimpleDotPos
         * @instance
         */
        SimpleDotPos.prototype.parts = $util.emptyArray;

        /**
         * Creates a new SimpleDotPos instance using the specified properties.
         * @function create
         * @memberof sync.SimpleDotPos
         * @static
         * @param {sync.ISimpleDotPos=} [properties] Properties to set
         * @returns {sync.SimpleDotPos} SimpleDotPos instance
         */
        SimpleDotPos.create = function create(properties) {
            return new SimpleDotPos(properties);
        };

        /**
         * Encodes the specified SimpleDotPos message. Does not implicitly {@link sync.SimpleDotPos.verify|verify} messages.
         * @function encode
         * @memberof sync.SimpleDotPos
         * @static
         * @param {sync.ISimpleDotPos} message SimpleDotPos message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SimpleDotPos.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.parts != null && message.parts.length)
                for (let i = 0; i < message.parts.length; ++i)
                    $root.sync.SimpleDotPosPart.encode(message.parts[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a SimpleDotPos message from the specified reader or buffer.
         * @function decode
         * @memberof sync.SimpleDotPos
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.SimpleDotPos} SimpleDotPos
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SimpleDotPos.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.SimpleDotPos();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.parts && message.parts.length))
                        message.parts = [];
                    message.parts.push($root.sync.SimpleDotPosPart.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return SimpleDotPos;
    })();

    return sync;
})();

export const collaborator = $root.collaborator = (() => {

    /**
     * Namespace collaborator.
     * @exports collaborator
     * @namespace
     */
    const collaborator = {};

    collaborator.Collaborator = (function() {

        /**
         * Properties of a Collaborator.
         * @memberof collaborator
         * @interface ICollaborator
         * @property {number|null} [muteCoreId] Collaborator muteCoreId
         * @property {string|null} [displayName] Collaborator displayName
         * @property {string|null} [login] Collaborator login
         * @property {string|null} [email] Collaborator email
         * @property {string|null} [avatar] Collaborator avatar
         * @property {string|null} [deviceID] Collaborator deviceID
         */

        /**
         * Constructs a new Collaborator.
         * @memberof collaborator
         * @classdesc Represents a Collaborator.
         * @implements ICollaborator
         * @constructor
         * @param {collaborator.ICollaborator=} [properties] Properties to set
         */
        function Collaborator(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Collaborator muteCoreId.
         * @member {number} muteCoreId
         * @memberof collaborator.Collaborator
         * @instance
         */
        Collaborator.prototype.muteCoreId = 0;

        /**
         * Collaborator displayName.
         * @member {string} displayName
         * @memberof collaborator.Collaborator
         * @instance
         */
        Collaborator.prototype.displayName = "";

        /**
         * Collaborator login.
         * @member {string} login
         * @memberof collaborator.Collaborator
         * @instance
         */
        Collaborator.prototype.login = "";

        /**
         * Collaborator email.
         * @member {string} email
         * @memberof collaborator.Collaborator
         * @instance
         */
        Collaborator.prototype.email = "";

        /**
         * Collaborator avatar.
         * @member {string} avatar
         * @memberof collaborator.Collaborator
         * @instance
         */
        Collaborator.prototype.avatar = "";

        /**
         * Collaborator deviceID.
         * @member {string} deviceID
         * @memberof collaborator.Collaborator
         * @instance
         */
        Collaborator.prototype.deviceID = "";

        /**
         * Creates a new Collaborator instance using the specified properties.
         * @function create
         * @memberof collaborator.Collaborator
         * @static
         * @param {collaborator.ICollaborator=} [properties] Properties to set
         * @returns {collaborator.Collaborator} Collaborator instance
         */
        Collaborator.create = function create(properties) {
            return new Collaborator(properties);
        };

        /**
         * Encodes the specified Collaborator message. Does not implicitly {@link collaborator.Collaborator.verify|verify} messages.
         * @function encode
         * @memberof collaborator.Collaborator
         * @static
         * @param {collaborator.ICollaborator} message Collaborator message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Collaborator.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.muteCoreId != null && Object.hasOwnProperty.call(message, "muteCoreId"))
                writer.uint32(/* id 1, wireType 0 =*/8).sint32(message.muteCoreId);
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.displayName);
            if (message.login != null && Object.hasOwnProperty.call(message, "login"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.login);
            if (message.email != null && Object.hasOwnProperty.call(message, "email"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.email);
            if (message.avatar != null && Object.hasOwnProperty.call(message, "avatar"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.avatar);
            if (message.deviceID != null && Object.hasOwnProperty.call(message, "deviceID"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.deviceID);
            return writer;
        };

        /**
         * Decodes a Collaborator message from the specified reader or buffer.
         * @function decode
         * @memberof collaborator.Collaborator
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {collaborator.Collaborator} Collaborator
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Collaborator.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.collaborator.Collaborator();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.muteCoreId = reader.sint32();
                    break;
                case 2:
                    message.displayName = reader.string();
                    break;
                case 3:
                    message.login = reader.string();
                    break;
                case 4:
                    message.email = reader.string();
                    break;
                case 5:
                    message.avatar = reader.string();
                    break;
                case 6:
                    message.deviceID = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return Collaborator;
    })();

    return collaborator;
})();

export const metadata = $root.metadata = (() => {

    /**
     * Namespace metadata.
     * @exports metadata
     * @namespace
     */
    const metadata = {};

    metadata.MetaData = (function() {

        /**
         * Properties of a MetaData.
         * @memberof metadata
         * @interface IMetaData
         * @property {number|null} [type] MetaData type
         * @property {string|null} [data] MetaData data
         */

        /**
         * Constructs a new MetaData.
         * @memberof metadata
         * @classdesc Represents a MetaData.
         * @implements IMetaData
         * @constructor
         * @param {metadata.IMetaData=} [properties] Properties to set
         */
        function MetaData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MetaData type.
         * @member {number} type
         * @memberof metadata.MetaData
         * @instance
         */
        MetaData.prototype.type = 0;

        /**
         * MetaData data.
         * @member {string} data
         * @memberof metadata.MetaData
         * @instance
         */
        MetaData.prototype.data = "";

        /**
         * Creates a new MetaData instance using the specified properties.
         * @function create
         * @memberof metadata.MetaData
         * @static
         * @param {metadata.IMetaData=} [properties] Properties to set
         * @returns {metadata.MetaData} MetaData instance
         */
        MetaData.create = function create(properties) {
            return new MetaData(properties);
        };

        /**
         * Encodes the specified MetaData message. Does not implicitly {@link metadata.MetaData.verify|verify} messages.
         * @function encode
         * @memberof metadata.MetaData
         * @static
         * @param {metadata.IMetaData} message MetaData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MetaData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 0, wireType 0 =*/0).int32(message.type);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.data);
            return writer;
        };

        /**
         * Decodes a MetaData message from the specified reader or buffer.
         * @function decode
         * @memberof metadata.MetaData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {metadata.MetaData} MetaData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MetaData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.metadata.MetaData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 0:
                    message.type = reader.int32();
                    break;
                case 1:
                    message.data = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return MetaData;
    })();

    return metadata;
})();

export { $root as default };

/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
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

    sync.SyncMsg = (function() {

        /**
         * Properties of a SyncMsg.
         * @memberof sync
         * @interface ISyncMsg
         * @property {sync.IRichLogootSOperationMsg} [richLogootSOpMsg] SyncMsg richLogootSOpMsg
         * @property {sync.IQuerySyncMsg} [querySync] SyncMsg querySync
         * @property {sync.IReplySyncMsg} [replySync] SyncMsg replySync
         */

        /**
         * Constructs a new SyncMsg.
         * @memberof sync
         * @classdesc Represents a SyncMsg.
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
         * SyncMsg richLogootSOpMsg.
         * @member {(sync.IRichLogootSOperationMsg|null|undefined)}richLogootSOpMsg
         * @memberof sync.SyncMsg
         * @instance
         */
        SyncMsg.prototype.richLogootSOpMsg = null;

        /**
         * SyncMsg querySync.
         * @member {(sync.IQuerySyncMsg|null|undefined)}querySync
         * @memberof sync.SyncMsg
         * @instance
         */
        SyncMsg.prototype.querySync = null;

        /**
         * SyncMsg replySync.
         * @member {(sync.IReplySyncMsg|null|undefined)}replySync
         * @memberof sync.SyncMsg
         * @instance
         */
        SyncMsg.prototype.replySync = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * SyncMsg type.
         * @member {string|undefined} type
         * @memberof sync.SyncMsg
         * @instance
         */
        Object.defineProperty(SyncMsg.prototype, "type", {
            get: $util.oneOfGetter($oneOfFields = ["richLogootSOpMsg", "querySync", "replySync"]),
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
            if (message.richLogootSOpMsg != null && message.hasOwnProperty("richLogootSOpMsg"))
                $root.sync.RichLogootSOperationMsg.encode(message.richLogootSOpMsg, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.querySync != null && message.hasOwnProperty("querySync"))
                $root.sync.QuerySyncMsg.encode(message.querySync, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.replySync != null && message.hasOwnProperty("replySync"))
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
                    message.richLogootSOpMsg = $root.sync.RichLogootSOperationMsg.decode(reader, reader.uint32());
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

    sync.RichLogootSOperationMsg = (function() {

        /**
         * Properties of a RichLogootSOperationMsg.
         * @memberof sync
         * @interface IRichLogootSOperationMsg
         * @property {number} [id] RichLogootSOperationMsg id
         * @property {number} [clock] RichLogootSOperationMsg clock
         * @property {sync.ILogootSAddMsg} [logootSAddMsg] RichLogootSOperationMsg logootSAddMsg
         * @property {sync.ILogootSDelMsg} [logootSDelMsg] RichLogootSOperationMsg logootSDelMsg
         */

        /**
         * Constructs a new RichLogootSOperationMsg.
         * @memberof sync
         * @classdesc Represents a RichLogootSOperationMsg.
         * @constructor
         * @param {sync.IRichLogootSOperationMsg=} [properties] Properties to set
         */
        function RichLogootSOperationMsg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RichLogootSOperationMsg id.
         * @member {number}id
         * @memberof sync.RichLogootSOperationMsg
         * @instance
         */
        RichLogootSOperationMsg.prototype.id = 0;

        /**
         * RichLogootSOperationMsg clock.
         * @member {number}clock
         * @memberof sync.RichLogootSOperationMsg
         * @instance
         */
        RichLogootSOperationMsg.prototype.clock = 0;

        /**
         * RichLogootSOperationMsg logootSAddMsg.
         * @member {(sync.ILogootSAddMsg|null|undefined)}logootSAddMsg
         * @memberof sync.RichLogootSOperationMsg
         * @instance
         */
        RichLogootSOperationMsg.prototype.logootSAddMsg = null;

        /**
         * RichLogootSOperationMsg logootSDelMsg.
         * @member {(sync.ILogootSDelMsg|null|undefined)}logootSDelMsg
         * @memberof sync.RichLogootSOperationMsg
         * @instance
         */
        RichLogootSOperationMsg.prototype.logootSDelMsg = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * RichLogootSOperationMsg type.
         * @member {string|undefined} type
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
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.clock != null && message.hasOwnProperty("clock"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.clock);
            if (message.logootSAddMsg != null && message.hasOwnProperty("logootSAddMsg"))
                $root.sync.LogootSAddMsg.encode(message.logootSAddMsg, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.logootSDelMsg != null && message.hasOwnProperty("logootSDelMsg"))
                $root.sync.LogootSDelMsg.encode(message.logootSDelMsg, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.RichLogootSOperationMsg();
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
         * @property {sync.IIdentifierMsg} [id] LogootSAddMsg id
         * @property {string} [content] LogootSAddMsg content
         */

        /**
         * Constructs a new LogootSAddMsg.
         * @memberof sync
         * @classdesc Represents a LogootSAddMsg.
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
         * @member {(sync.IIdentifierMsg|null|undefined)}id
         * @memberof sync.LogootSAddMsg
         * @instance
         */
        LogootSAddMsg.prototype.id = null;

        /**
         * LogootSAddMsg content.
         * @member {string}content
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
            if (message.id != null && message.hasOwnProperty("id"))
                $root.sync.IdentifierMsg.encode(message.id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.content != null && message.hasOwnProperty("content"))
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

    sync.IdentifierMsg = (function() {

        /**
         * Properties of an IdentifierMsg.
         * @memberof sync
         * @interface IIdentifierMsg
         * @property {Array.<sync.IIdentifierTupleMsg>} [tuples] IdentifierMsg tuples
         */

        /**
         * Constructs a new IdentifierMsg.
         * @memberof sync
         * @classdesc Represents an IdentifierMsg.
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
         * @member {Array.<sync.IIdentifierTupleMsg>}tuples
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
         * @property {number} [random] IdentifierTupleMsg random
         * @property {number} [replicaNumber] IdentifierTupleMsg replicaNumber
         * @property {number} [clock] IdentifierTupleMsg clock
         * @property {number} [offset] IdentifierTupleMsg offset
         */

        /**
         * Constructs a new IdentifierTupleMsg.
         * @memberof sync
         * @classdesc Represents an IdentifierTupleMsg.
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
         * @member {number}random
         * @memberof sync.IdentifierTupleMsg
         * @instance
         */
        IdentifierTupleMsg.prototype.random = 0;

        /**
         * IdentifierTupleMsg replicaNumber.
         * @member {number}replicaNumber
         * @memberof sync.IdentifierTupleMsg
         * @instance
         */
        IdentifierTupleMsg.prototype.replicaNumber = 0;

        /**
         * IdentifierTupleMsg clock.
         * @member {number}clock
         * @memberof sync.IdentifierTupleMsg
         * @instance
         */
        IdentifierTupleMsg.prototype.clock = 0;

        /**
         * IdentifierTupleMsg offset.
         * @member {number}offset
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
            if (message.random != null && message.hasOwnProperty("random"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.random);
            if (message.replicaNumber != null && message.hasOwnProperty("replicaNumber"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.replicaNumber);
            if (message.clock != null && message.hasOwnProperty("clock"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.clock);
            if (message.offset != null && message.hasOwnProperty("offset"))
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

    sync.LogootSDelMsg = (function() {

        /**
         * Properties of a LogootSDelMsg.
         * @memberof sync
         * @interface ILogootSDelMsg
         * @property {Array.<sync.IIdentifierIntervalMsg>} [lid] LogootSDelMsg lid
         */

        /**
         * Constructs a new LogootSDelMsg.
         * @memberof sync
         * @classdesc Represents a LogootSDelMsg.
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
         * @member {Array.<sync.IIdentifierIntervalMsg>}lid
         * @memberof sync.LogootSDelMsg
         * @instance
         */
        LogootSDelMsg.prototype.lid = $util.emptyArray;

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
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return LogootSDelMsg;
    })();

    sync.IdentifierIntervalMsg = (function() {

        /**
         * Properties of an IdentifierIntervalMsg.
         * @memberof sync
         * @interface IIdentifierIntervalMsg
         * @property {sync.IIdentifierMsg} [idBegin] IdentifierIntervalMsg idBegin
         * @property {number} [end] IdentifierIntervalMsg end
         */

        /**
         * Constructs a new IdentifierIntervalMsg.
         * @memberof sync
         * @classdesc Represents an IdentifierIntervalMsg.
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
         * @member {(sync.IIdentifierMsg|null|undefined)}idBegin
         * @memberof sync.IdentifierIntervalMsg
         * @instance
         */
        IdentifierIntervalMsg.prototype.idBegin = null;

        /**
         * IdentifierIntervalMsg end.
         * @member {number}end
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
            if (message.idBegin != null && message.hasOwnProperty("idBegin"))
                $root.sync.IdentifierMsg.encode(message.idBegin, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.end != null && message.hasOwnProperty("end"))
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

    sync.QuerySyncMsg = (function() {

        /**
         * Properties of a QuerySyncMsg.
         * @memberof sync
         * @interface IQuerySyncMsg
         * @property {Object.<string,number>} [vector] QuerySyncMsg vector
         */

        /**
         * Constructs a new QuerySyncMsg.
         * @memberof sync
         * @classdesc Represents a QuerySyncMsg.
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
         * @member {Object.<string,number>}vector
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
            if (message.vector != null && message.hasOwnProperty("vector"))
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.sync.QuerySyncMsg(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    reader.skip().pos++;
                    if (message.vector === $util.emptyObject)
                        message.vector = {};
                    key = reader.int32();
                    reader.pos++;
                    message.vector[key] = reader.int32();
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
         * @property {Array.<sync.IRichLogootSOperationMsg>} [richLogootSOpsMsg] ReplySyncMsg richLogootSOpsMsg
         * @property {Array.<sync.IIntervalMsg>} [intervals] ReplySyncMsg intervals
         */

        /**
         * Constructs a new ReplySyncMsg.
         * @memberof sync
         * @classdesc Represents a ReplySyncMsg.
         * @constructor
         * @param {sync.IReplySyncMsg=} [properties] Properties to set
         */
        function ReplySyncMsg(properties) {
            this.richLogootSOpsMsg = [];
            this.intervals = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ReplySyncMsg richLogootSOpsMsg.
         * @member {Array.<sync.IRichLogootSOperationMsg>}richLogootSOpsMsg
         * @memberof sync.ReplySyncMsg
         * @instance
         */
        ReplySyncMsg.prototype.richLogootSOpsMsg = $util.emptyArray;

        /**
         * ReplySyncMsg intervals.
         * @member {Array.<sync.IIntervalMsg>}intervals
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
            if (message.richLogootSOpsMsg != null && message.richLogootSOpsMsg.length)
                for (let i = 0; i < message.richLogootSOpsMsg.length; ++i)
                    $root.sync.RichLogootSOperationMsg.encode(message.richLogootSOpsMsg[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
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
                    if (!(message.richLogootSOpsMsg && message.richLogootSOpsMsg.length))
                        message.richLogootSOpsMsg = [];
                    message.richLogootSOpsMsg.push($root.sync.RichLogootSOperationMsg.decode(reader, reader.uint32()));
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

    sync.IntervalMsg = (function() {

        /**
         * Properties of an IntervalMsg.
         * @memberof sync
         * @interface IIntervalMsg
         * @property {number} [id] IntervalMsg id
         * @property {number} [begin] IntervalMsg begin
         * @property {number} [end] IntervalMsg end
         */

        /**
         * Constructs a new IntervalMsg.
         * @memberof sync
         * @classdesc Represents an IntervalMsg.
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
         * @member {number}id
         * @memberof sync.IntervalMsg
         * @instance
         */
        IntervalMsg.prototype.id = 0;

        /**
         * IntervalMsg begin.
         * @member {number}begin
         * @memberof sync.IntervalMsg
         * @instance
         */
        IntervalMsg.prototype.begin = 0;

        /**
         * IntervalMsg end.
         * @member {number}end
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
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.begin != null && message.hasOwnProperty("begin"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.begin);
            if (message.end != null && message.hasOwnProperty("end"))
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

    return sync;
})();

export const collaborator = $root.collaborator = (() => {

    /**
     * Namespace collaborator.
     * @exports collaborator
     * @namespace
     */
    const collaborator = {};

    collaborator.CollaboratorMsg = (function() {

        /**
         * Properties of a CollaboratorMsg.
         * @memberof collaborator
         * @interface ICollaboratorMsg
         * @property {string} [pseudo] CollaboratorMsg pseudo
         */

        /**
         * Constructs a new CollaboratorMsg.
         * @memberof collaborator
         * @classdesc Represents a CollaboratorMsg.
         * @constructor
         * @param {collaborator.ICollaboratorMsg=} [properties] Properties to set
         */
        function CollaboratorMsg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CollaboratorMsg pseudo.
         * @member {string}pseudo
         * @memberof collaborator.CollaboratorMsg
         * @instance
         */
        CollaboratorMsg.prototype.pseudo = "";

        /**
         * Creates a new CollaboratorMsg instance using the specified properties.
         * @function create
         * @memberof collaborator.CollaboratorMsg
         * @static
         * @param {collaborator.ICollaboratorMsg=} [properties] Properties to set
         * @returns {collaborator.CollaboratorMsg} CollaboratorMsg instance
         */
        CollaboratorMsg.create = function create(properties) {
            return new CollaboratorMsg(properties);
        };

        /**
         * Encodes the specified CollaboratorMsg message. Does not implicitly {@link collaborator.CollaboratorMsg.verify|verify} messages.
         * @function encode
         * @memberof collaborator.CollaboratorMsg
         * @static
         * @param {collaborator.ICollaboratorMsg} message CollaboratorMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CollaboratorMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pseudo != null && message.hasOwnProperty("pseudo"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.pseudo);
            return writer;
        };

        /**
         * Decodes a CollaboratorMsg message from the specified reader or buffer.
         * @function decode
         * @memberof collaborator.CollaboratorMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {collaborator.CollaboratorMsg} CollaboratorMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CollaboratorMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.collaborator.CollaboratorMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.pseudo = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        return CollaboratorMsg;
    })();

    return collaborator;
})();

export { $root as default };

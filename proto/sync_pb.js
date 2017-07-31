/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Sync = (function() {

    /**
     * Properties of a Sync.
     * @exports ISync
     * @interface ISync
     * @property {IRichLogootSOperationMsg} [richLogootSOpMsg] Sync richLogootSOpMsg
     * @property {IQuerySync} [querySync] Sync querySync
     * @property {IReplySync} [replySync] Sync replySync
     */

    /**
     * Constructs a new Sync.
     * @exports Sync
     * @classdesc Represents a Sync.
     * @constructor
     * @param {ISync=} [properties] Properties to set
     */
    function Sync(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Sync richLogootSOpMsg.
     * @member {(IRichLogootSOperationMsg|null|undefined)}richLogootSOpMsg
     * @memberof Sync
     * @instance
     */
    Sync.prototype.richLogootSOpMsg = null;

    /**
     * Sync querySync.
     * @member {(IQuerySync|null|undefined)}querySync
     * @memberof Sync
     * @instance
     */
    Sync.prototype.querySync = null;

    /**
     * Sync replySync.
     * @member {(IReplySync|null|undefined)}replySync
     * @memberof Sync
     * @instance
     */
    Sync.prototype.replySync = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Sync type.
     * @member {string|undefined} type
     * @memberof Sync
     * @instance
     */
    Object.defineProperty(Sync.prototype, "type", {
        get: $util.oneOfGetter($oneOfFields = ["richLogootSOpMsg", "querySync", "replySync"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Sync instance using the specified properties.
     * @function create
     * @memberof Sync
     * @static
     * @param {ISync=} [properties] Properties to set
     * @returns {Sync} Sync instance
     */
    Sync.create = function create(properties) {
        return new Sync(properties);
    };

    /**
     * Encodes the specified Sync message. Does not implicitly {@link Sync.verify|verify} messages.
     * @function encode
     * @memberof Sync
     * @static
     * @param {ISync} message Sync message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Sync.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.richLogootSOpMsg != null && message.hasOwnProperty("richLogootSOpMsg"))
            $root.RichLogootSOperationMsg.encode(message.richLogootSOpMsg, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.querySync != null && message.hasOwnProperty("querySync"))
            $root.QuerySync.encode(message.querySync, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.replySync != null && message.hasOwnProperty("replySync"))
            $root.ReplySync.encode(message.replySync, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Decodes a Sync message from the specified reader or buffer.
     * @function decode
     * @memberof Sync
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Sync} Sync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Sync.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Sync();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.richLogootSOpMsg = $root.RichLogootSOperationMsg.decode(reader, reader.uint32());
                break;
            case 2:
                message.querySync = $root.QuerySync.decode(reader, reader.uint32());
                break;
            case 3:
                message.replySync = $root.ReplySync.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    return Sync;
})();

$root.RichLogootSOperationMsg = (function() {

    /**
     * Properties of a RichLogootSOperationMsg.
     * @exports IRichLogootSOperationMsg
     * @interface IRichLogootSOperationMsg
     * @property {number} [id] RichLogootSOperationMsg id
     * @property {number} [clock] RichLogootSOperationMsg clock
     * @property {ILogootSAddMsg} [logootSAddMsg] RichLogootSOperationMsg logootSAddMsg
     * @property {ILogootSDelMsg} [logootSDelMsg] RichLogootSOperationMsg logootSDelMsg
     */

    /**
     * Constructs a new RichLogootSOperationMsg.
     * @exports RichLogootSOperationMsg
     * @classdesc Represents a RichLogootSOperationMsg.
     * @constructor
     * @param {IRichLogootSOperationMsg=} [properties] Properties to set
     */
    function RichLogootSOperationMsg(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RichLogootSOperationMsg id.
     * @member {number}id
     * @memberof RichLogootSOperationMsg
     * @instance
     */
    RichLogootSOperationMsg.prototype.id = 0;

    /**
     * RichLogootSOperationMsg clock.
     * @member {number}clock
     * @memberof RichLogootSOperationMsg
     * @instance
     */
    RichLogootSOperationMsg.prototype.clock = 0;

    /**
     * RichLogootSOperationMsg logootSAddMsg.
     * @member {(ILogootSAddMsg|null|undefined)}logootSAddMsg
     * @memberof RichLogootSOperationMsg
     * @instance
     */
    RichLogootSOperationMsg.prototype.logootSAddMsg = null;

    /**
     * RichLogootSOperationMsg logootSDelMsg.
     * @member {(ILogootSDelMsg|null|undefined)}logootSDelMsg
     * @memberof RichLogootSOperationMsg
     * @instance
     */
    RichLogootSOperationMsg.prototype.logootSDelMsg = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * RichLogootSOperationMsg type.
     * @member {string|undefined} type
     * @memberof RichLogootSOperationMsg
     * @instance
     */
    Object.defineProperty(RichLogootSOperationMsg.prototype, "type", {
        get: $util.oneOfGetter($oneOfFields = ["logootSAddMsg", "logootSDelMsg"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new RichLogootSOperationMsg instance using the specified properties.
     * @function create
     * @memberof RichLogootSOperationMsg
     * @static
     * @param {IRichLogootSOperationMsg=} [properties] Properties to set
     * @returns {RichLogootSOperationMsg} RichLogootSOperationMsg instance
     */
    RichLogootSOperationMsg.create = function create(properties) {
        return new RichLogootSOperationMsg(properties);
    };

    /**
     * Encodes the specified RichLogootSOperationMsg message. Does not implicitly {@link RichLogootSOperationMsg.verify|verify} messages.
     * @function encode
     * @memberof RichLogootSOperationMsg
     * @static
     * @param {IRichLogootSOperationMsg} message RichLogootSOperationMsg message or plain object to encode
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
            $root.LogootSAddMsg.encode(message.logootSAddMsg, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.logootSDelMsg != null && message.hasOwnProperty("logootSDelMsg"))
            $root.LogootSDelMsg.encode(message.logootSDelMsg, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Decodes a RichLogootSOperationMsg message from the specified reader or buffer.
     * @function decode
     * @memberof RichLogootSOperationMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RichLogootSOperationMsg} RichLogootSOperationMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RichLogootSOperationMsg.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RichLogootSOperationMsg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.int32();
                break;
            case 2:
                message.clock = reader.int32();
                break;
            case 3:
                message.logootSAddMsg = $root.LogootSAddMsg.decode(reader, reader.uint32());
                break;
            case 4:
                message.logootSDelMsg = $root.LogootSDelMsg.decode(reader, reader.uint32());
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

$root.LogootSAddMsg = (function() {

    /**
     * Properties of a LogootSAddMsg.
     * @exports ILogootSAddMsg
     * @interface ILogootSAddMsg
     * @property {IIdentifierMsg} [id] LogootSAddMsg id
     * @property {string} [content] LogootSAddMsg content
     */

    /**
     * Constructs a new LogootSAddMsg.
     * @exports LogootSAddMsg
     * @classdesc Represents a LogootSAddMsg.
     * @constructor
     * @param {ILogootSAddMsg=} [properties] Properties to set
     */
    function LogootSAddMsg(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LogootSAddMsg id.
     * @member {(IIdentifierMsg|null|undefined)}id
     * @memberof LogootSAddMsg
     * @instance
     */
    LogootSAddMsg.prototype.id = null;

    /**
     * LogootSAddMsg content.
     * @member {string}content
     * @memberof LogootSAddMsg
     * @instance
     */
    LogootSAddMsg.prototype.content = "";

    /**
     * Creates a new LogootSAddMsg instance using the specified properties.
     * @function create
     * @memberof LogootSAddMsg
     * @static
     * @param {ILogootSAddMsg=} [properties] Properties to set
     * @returns {LogootSAddMsg} LogootSAddMsg instance
     */
    LogootSAddMsg.create = function create(properties) {
        return new LogootSAddMsg(properties);
    };

    /**
     * Encodes the specified LogootSAddMsg message. Does not implicitly {@link LogootSAddMsg.verify|verify} messages.
     * @function encode
     * @memberof LogootSAddMsg
     * @static
     * @param {ILogootSAddMsg} message LogootSAddMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogootSAddMsg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && message.hasOwnProperty("id"))
            $root.IdentifierMsg.encode(message.id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.content != null && message.hasOwnProperty("content"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.content);
        return writer;
    };

    /**
     * Decodes a LogootSAddMsg message from the specified reader or buffer.
     * @function decode
     * @memberof LogootSAddMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LogootSAddMsg} LogootSAddMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogootSAddMsg.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogootSAddMsg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = $root.IdentifierMsg.decode(reader, reader.uint32());
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

$root.IdentifierMsg = (function() {

    /**
     * Properties of an IdentifierMsg.
     * @exports IIdentifierMsg
     * @interface IIdentifierMsg
     * @property {Array.<number>} [base] IdentifierMsg base
     * @property {number} [last] IdentifierMsg last
     */

    /**
     * Constructs a new IdentifierMsg.
     * @exports IdentifierMsg
     * @classdesc Represents an IdentifierMsg.
     * @constructor
     * @param {IIdentifierMsg=} [properties] Properties to set
     */
    function IdentifierMsg(properties) {
        this.base = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * IdentifierMsg base.
     * @member {Array.<number>}base
     * @memberof IdentifierMsg
     * @instance
     */
    IdentifierMsg.prototype.base = $util.emptyArray;

    /**
     * IdentifierMsg last.
     * @member {number}last
     * @memberof IdentifierMsg
     * @instance
     */
    IdentifierMsg.prototype.last = 0;

    /**
     * Creates a new IdentifierMsg instance using the specified properties.
     * @function create
     * @memberof IdentifierMsg
     * @static
     * @param {IIdentifierMsg=} [properties] Properties to set
     * @returns {IdentifierMsg} IdentifierMsg instance
     */
    IdentifierMsg.create = function create(properties) {
        return new IdentifierMsg(properties);
    };

    /**
     * Encodes the specified IdentifierMsg message. Does not implicitly {@link IdentifierMsg.verify|verify} messages.
     * @function encode
     * @memberof IdentifierMsg
     * @static
     * @param {IIdentifierMsg} message IdentifierMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    IdentifierMsg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.base != null && message.base.length) {
            writer.uint32(/* id 1, wireType 2 =*/10).fork();
            for (var i = 0; i < message.base.length; ++i)
                writer.int32(message.base[i]);
            writer.ldelim();
        }
        if (message.last != null && message.hasOwnProperty("last"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.last);
        return writer;
    };

    /**
     * Decodes an IdentifierMsg message from the specified reader or buffer.
     * @function decode
     * @memberof IdentifierMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {IdentifierMsg} IdentifierMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    IdentifierMsg.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.IdentifierMsg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.base && message.base.length))
                    message.base = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.base.push(reader.int32());
                } else
                    message.base.push(reader.int32());
                break;
            case 2:
                message.last = reader.int32();
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

$root.LogootSDelMsg = (function() {

    /**
     * Properties of a LogootSDelMsg.
     * @exports ILogootSDelMsg
     * @interface ILogootSDelMsg
     * @property {Array.<IIdentifierIntervalMsg>} [lid] LogootSDelMsg lid
     */

    /**
     * Constructs a new LogootSDelMsg.
     * @exports LogootSDelMsg
     * @classdesc Represents a LogootSDelMsg.
     * @constructor
     * @param {ILogootSDelMsg=} [properties] Properties to set
     */
    function LogootSDelMsg(properties) {
        this.lid = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LogootSDelMsg lid.
     * @member {Array.<IIdentifierIntervalMsg>}lid
     * @memberof LogootSDelMsg
     * @instance
     */
    LogootSDelMsg.prototype.lid = $util.emptyArray;

    /**
     * Creates a new LogootSDelMsg instance using the specified properties.
     * @function create
     * @memberof LogootSDelMsg
     * @static
     * @param {ILogootSDelMsg=} [properties] Properties to set
     * @returns {LogootSDelMsg} LogootSDelMsg instance
     */
    LogootSDelMsg.create = function create(properties) {
        return new LogootSDelMsg(properties);
    };

    /**
     * Encodes the specified LogootSDelMsg message. Does not implicitly {@link LogootSDelMsg.verify|verify} messages.
     * @function encode
     * @memberof LogootSDelMsg
     * @static
     * @param {ILogootSDelMsg} message LogootSDelMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogootSDelMsg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.lid != null && message.lid.length)
            for (var i = 0; i < message.lid.length; ++i)
                $root.IdentifierIntervalMsg.encode(message.lid[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Decodes a LogootSDelMsg message from the specified reader or buffer.
     * @function decode
     * @memberof LogootSDelMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LogootSDelMsg} LogootSDelMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogootSDelMsg.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogootSDelMsg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.lid && message.lid.length))
                    message.lid = [];
                message.lid.push($root.IdentifierIntervalMsg.decode(reader, reader.uint32()));
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

$root.IdentifierIntervalMsg = (function() {

    /**
     * Properties of an IdentifierIntervalMsg.
     * @exports IIdentifierIntervalMsg
     * @interface IIdentifierIntervalMsg
     * @property {Array.<number>} [base] IdentifierIntervalMsg base
     * @property {number} [begin] IdentifierIntervalMsg begin
     * @property {number} [end] IdentifierIntervalMsg end
     */

    /**
     * Constructs a new IdentifierIntervalMsg.
     * @exports IdentifierIntervalMsg
     * @classdesc Represents an IdentifierIntervalMsg.
     * @constructor
     * @param {IIdentifierIntervalMsg=} [properties] Properties to set
     */
    function IdentifierIntervalMsg(properties) {
        this.base = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * IdentifierIntervalMsg base.
     * @member {Array.<number>}base
     * @memberof IdentifierIntervalMsg
     * @instance
     */
    IdentifierIntervalMsg.prototype.base = $util.emptyArray;

    /**
     * IdentifierIntervalMsg begin.
     * @member {number}begin
     * @memberof IdentifierIntervalMsg
     * @instance
     */
    IdentifierIntervalMsg.prototype.begin = 0;

    /**
     * IdentifierIntervalMsg end.
     * @member {number}end
     * @memberof IdentifierIntervalMsg
     * @instance
     */
    IdentifierIntervalMsg.prototype.end = 0;

    /**
     * Creates a new IdentifierIntervalMsg instance using the specified properties.
     * @function create
     * @memberof IdentifierIntervalMsg
     * @static
     * @param {IIdentifierIntervalMsg=} [properties] Properties to set
     * @returns {IdentifierIntervalMsg} IdentifierIntervalMsg instance
     */
    IdentifierIntervalMsg.create = function create(properties) {
        return new IdentifierIntervalMsg(properties);
    };

    /**
     * Encodes the specified IdentifierIntervalMsg message. Does not implicitly {@link IdentifierIntervalMsg.verify|verify} messages.
     * @function encode
     * @memberof IdentifierIntervalMsg
     * @static
     * @param {IIdentifierIntervalMsg} message IdentifierIntervalMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    IdentifierIntervalMsg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.base != null && message.base.length) {
            writer.uint32(/* id 1, wireType 2 =*/10).fork();
            for (var i = 0; i < message.base.length; ++i)
                writer.int32(message.base[i]);
            writer.ldelim();
        }
        if (message.begin != null && message.hasOwnProperty("begin"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.begin);
        if (message.end != null && message.hasOwnProperty("end"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.end);
        return writer;
    };

    /**
     * Decodes an IdentifierIntervalMsg message from the specified reader or buffer.
     * @function decode
     * @memberof IdentifierIntervalMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {IdentifierIntervalMsg} IdentifierIntervalMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    IdentifierIntervalMsg.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.IdentifierIntervalMsg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.base && message.base.length))
                    message.base = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.base.push(reader.int32());
                } else
                    message.base.push(reader.int32());
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

    return IdentifierIntervalMsg;
})();

$root.QuerySync = (function() {

    /**
     * Properties of a QuerySync.
     * @exports IQuerySync
     * @interface IQuerySync
     * @property {Object.<string,number>} [vector] QuerySync vector
     */

    /**
     * Constructs a new QuerySync.
     * @exports QuerySync
     * @classdesc Represents a QuerySync.
     * @constructor
     * @param {IQuerySync=} [properties] Properties to set
     */
    function QuerySync(properties) {
        this.vector = {};
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * QuerySync vector.
     * @member {Object.<string,number>}vector
     * @memberof QuerySync
     * @instance
     */
    QuerySync.prototype.vector = $util.emptyObject;

    /**
     * Creates a new QuerySync instance using the specified properties.
     * @function create
     * @memberof QuerySync
     * @static
     * @param {IQuerySync=} [properties] Properties to set
     * @returns {QuerySync} QuerySync instance
     */
    QuerySync.create = function create(properties) {
        return new QuerySync(properties);
    };

    /**
     * Encodes the specified QuerySync message. Does not implicitly {@link QuerySync.verify|verify} messages.
     * @function encode
     * @memberof QuerySync
     * @static
     * @param {IQuerySync} message QuerySync message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    QuerySync.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.vector != null && message.hasOwnProperty("vector"))
            for (var keys = Object.keys(message.vector), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 0 =*/8).int32(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.vector[keys[i]]).ldelim();
        return writer;
    };

    /**
     * Decodes a QuerySync message from the specified reader or buffer.
     * @function decode
     * @memberof QuerySync
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {QuerySync} QuerySync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    QuerySync.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.QuerySync(), key;
        while (reader.pos < end) {
            var tag = reader.uint32();
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

    return QuerySync;
})();

$root.ReplySync = (function() {

    /**
     * Properties of a ReplySync.
     * @exports IReplySync
     * @interface IReplySync
     * @property {Array.<IRichLogootSOperationMsg>} [richLogootSOpsMsg] ReplySync richLogootSOpsMsg
     * @property {Array.<IIntervalMsg>} [intervals] ReplySync intervals
     */

    /**
     * Constructs a new ReplySync.
     * @exports ReplySync
     * @classdesc Represents a ReplySync.
     * @constructor
     * @param {IReplySync=} [properties] Properties to set
     */
    function ReplySync(properties) {
        this.richLogootSOpsMsg = [];
        this.intervals = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ReplySync richLogootSOpsMsg.
     * @member {Array.<IRichLogootSOperationMsg>}richLogootSOpsMsg
     * @memberof ReplySync
     * @instance
     */
    ReplySync.prototype.richLogootSOpsMsg = $util.emptyArray;

    /**
     * ReplySync intervals.
     * @member {Array.<IIntervalMsg>}intervals
     * @memberof ReplySync
     * @instance
     */
    ReplySync.prototype.intervals = $util.emptyArray;

    /**
     * Creates a new ReplySync instance using the specified properties.
     * @function create
     * @memberof ReplySync
     * @static
     * @param {IReplySync=} [properties] Properties to set
     * @returns {ReplySync} ReplySync instance
     */
    ReplySync.create = function create(properties) {
        return new ReplySync(properties);
    };

    /**
     * Encodes the specified ReplySync message. Does not implicitly {@link ReplySync.verify|verify} messages.
     * @function encode
     * @memberof ReplySync
     * @static
     * @param {IReplySync} message ReplySync message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ReplySync.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.richLogootSOpsMsg != null && message.richLogootSOpsMsg.length)
            for (var i = 0; i < message.richLogootSOpsMsg.length; ++i)
                $root.RichLogootSOperationMsg.encode(message.richLogootSOpsMsg[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.intervals != null && message.intervals.length)
            for (var i = 0; i < message.intervals.length; ++i)
                $root.IntervalMsg.encode(message.intervals[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Decodes a ReplySync message from the specified reader or buffer.
     * @function decode
     * @memberof ReplySync
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ReplySync} ReplySync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ReplySync.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ReplySync();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.richLogootSOpsMsg && message.richLogootSOpsMsg.length))
                    message.richLogootSOpsMsg = [];
                message.richLogootSOpsMsg.push($root.RichLogootSOperationMsg.decode(reader, reader.uint32()));
                break;
            case 2:
                if (!(message.intervals && message.intervals.length))
                    message.intervals = [];
                message.intervals.push($root.IntervalMsg.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    return ReplySync;
})();

$root.IntervalMsg = (function() {

    /**
     * Properties of an IntervalMsg.
     * @exports IIntervalMsg
     * @interface IIntervalMsg
     * @property {number} [id] IntervalMsg id
     * @property {number} [begin] IntervalMsg begin
     * @property {number} [end] IntervalMsg end
     */

    /**
     * Constructs a new IntervalMsg.
     * @exports IntervalMsg
     * @classdesc Represents an IntervalMsg.
     * @constructor
     * @param {IIntervalMsg=} [properties] Properties to set
     */
    function IntervalMsg(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * IntervalMsg id.
     * @member {number}id
     * @memberof IntervalMsg
     * @instance
     */
    IntervalMsg.prototype.id = 0;

    /**
     * IntervalMsg begin.
     * @member {number}begin
     * @memberof IntervalMsg
     * @instance
     */
    IntervalMsg.prototype.begin = 0;

    /**
     * IntervalMsg end.
     * @member {number}end
     * @memberof IntervalMsg
     * @instance
     */
    IntervalMsg.prototype.end = 0;

    /**
     * Creates a new IntervalMsg instance using the specified properties.
     * @function create
     * @memberof IntervalMsg
     * @static
     * @param {IIntervalMsg=} [properties] Properties to set
     * @returns {IntervalMsg} IntervalMsg instance
     */
    IntervalMsg.create = function create(properties) {
        return new IntervalMsg(properties);
    };

    /**
     * Encodes the specified IntervalMsg message. Does not implicitly {@link IntervalMsg.verify|verify} messages.
     * @function encode
     * @memberof IntervalMsg
     * @static
     * @param {IIntervalMsg} message IntervalMsg message or plain object to encode
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
     * @memberof IntervalMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {IntervalMsg} IntervalMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    IntervalMsg.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.IntervalMsg();
        while (reader.pos < end) {
            var tag = reader.uint32();
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

module.exports = $root;

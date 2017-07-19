/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Sync = $root.Sync = (() => {

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
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
    let $oneOfFields;

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
     * Encodes the specified Sync message, length delimited. Does not implicitly {@link Sync.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Sync
     * @static
     * @param {ISync} message Sync message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Sync.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
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
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Sync();
        while (reader.pos < end) {
            let tag = reader.uint32();
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

    /**
     * Decodes a Sync message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Sync
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Sync} Sync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Sync.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Sync message.
     * @function verify
     * @memberof Sync
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Sync.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        let properties = {};
        if (message.richLogootSOpMsg != null && message.hasOwnProperty("richLogootSOpMsg")) {
            properties.type = 1;
            let error = $root.RichLogootSOperationMsg.verify(message.richLogootSOpMsg);
            if (error)
                return "richLogootSOpMsg." + error;
        }
        if (message.querySync != null && message.hasOwnProperty("querySync")) {
            if (properties.type === 1)
                return "type: multiple values";
            properties.type = 1;
            error = $root.QuerySync.verify(message.querySync);
            if (error)
                return "querySync." + error;
        }
        if (message.replySync != null && message.hasOwnProperty("replySync")) {
            if (properties.type === 1)
                return "type: multiple values";
            properties.type = 1;
            error = $root.ReplySync.verify(message.replySync);
            if (error)
                return "replySync." + error;
        }
        return null;
    };

    /**
     * Creates a Sync message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Sync
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Sync} Sync
     */
    Sync.fromObject = function fromObject(object) {
        if (object instanceof $root.Sync)
            return object;
        let message = new $root.Sync();
        if (object.richLogootSOpMsg != null) {
            if (typeof object.richLogootSOpMsg !== "object")
                throw TypeError(".Sync.richLogootSOpMsg: object expected");
            message.richLogootSOpMsg = $root.RichLogootSOperationMsg.fromObject(object.richLogootSOpMsg);
        }
        if (object.querySync != null) {
            if (typeof object.querySync !== "object")
                throw TypeError(".Sync.querySync: object expected");
            message.querySync = $root.QuerySync.fromObject(object.querySync);
        }
        if (object.replySync != null) {
            if (typeof object.replySync !== "object")
                throw TypeError(".Sync.replySync: object expected");
            message.replySync = $root.ReplySync.fromObject(object.replySync);
        }
        return message;
    };

    /**
     * Creates a plain object from a Sync message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Sync
     * @static
     * @param {Sync} message Sync
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Sync.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (message.richLogootSOpMsg != null && message.hasOwnProperty("richLogootSOpMsg")) {
            object.richLogootSOpMsg = $root.RichLogootSOperationMsg.toObject(message.richLogootSOpMsg, options);
            if (options.oneofs)
                object.type = "richLogootSOpMsg";
        }
        if (message.querySync != null && message.hasOwnProperty("querySync")) {
            object.querySync = $root.QuerySync.toObject(message.querySync, options);
            if (options.oneofs)
                object.type = "querySync";
        }
        if (message.replySync != null && message.hasOwnProperty("replySync")) {
            object.replySync = $root.ReplySync.toObject(message.replySync, options);
            if (options.oneofs)
                object.type = "replySync";
        }
        return object;
    };

    /**
     * Converts this Sync to JSON.
     * @function toJSON
     * @memberof Sync
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Sync.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Sync;
})();

export const RichLogootSOperationMsg = $root.RichLogootSOperationMsg = (() => {

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
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
    let $oneOfFields;

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
     * Encodes the specified RichLogootSOperationMsg message, length delimited. Does not implicitly {@link RichLogootSOperationMsg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RichLogootSOperationMsg
     * @static
     * @param {IRichLogootSOperationMsg} message RichLogootSOperationMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RichLogootSOperationMsg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
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
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.RichLogootSOperationMsg();
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

    /**
     * Decodes a RichLogootSOperationMsg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RichLogootSOperationMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RichLogootSOperationMsg} RichLogootSOperationMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RichLogootSOperationMsg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RichLogootSOperationMsg message.
     * @function verify
     * @memberof RichLogootSOperationMsg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RichLogootSOperationMsg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        let properties = {};
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isInteger(message.id))
                return "id: integer expected";
        if (message.clock != null && message.hasOwnProperty("clock"))
            if (!$util.isInteger(message.clock))
                return "clock: integer expected";
        if (message.logootSAddMsg != null && message.hasOwnProperty("logootSAddMsg")) {
            properties.type = 1;
            let error = $root.LogootSAddMsg.verify(message.logootSAddMsg);
            if (error)
                return "logootSAddMsg." + error;
        }
        if (message.logootSDelMsg != null && message.hasOwnProperty("logootSDelMsg")) {
            if (properties.type === 1)
                return "type: multiple values";
            properties.type = 1;
            error = $root.LogootSDelMsg.verify(message.logootSDelMsg);
            if (error)
                return "logootSDelMsg." + error;
        }
        return null;
    };

    /**
     * Creates a RichLogootSOperationMsg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RichLogootSOperationMsg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RichLogootSOperationMsg} RichLogootSOperationMsg
     */
    RichLogootSOperationMsg.fromObject = function fromObject(object) {
        if (object instanceof $root.RichLogootSOperationMsg)
            return object;
        let message = new $root.RichLogootSOperationMsg();
        if (object.id != null)
            message.id = object.id | 0;
        if (object.clock != null)
            message.clock = object.clock | 0;
        if (object.logootSAddMsg != null) {
            if (typeof object.logootSAddMsg !== "object")
                throw TypeError(".RichLogootSOperationMsg.logootSAddMsg: object expected");
            message.logootSAddMsg = $root.LogootSAddMsg.fromObject(object.logootSAddMsg);
        }
        if (object.logootSDelMsg != null) {
            if (typeof object.logootSDelMsg !== "object")
                throw TypeError(".RichLogootSOperationMsg.logootSDelMsg: object expected");
            message.logootSDelMsg = $root.LogootSDelMsg.fromObject(object.logootSDelMsg);
        }
        return message;
    };

    /**
     * Creates a plain object from a RichLogootSOperationMsg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RichLogootSOperationMsg
     * @static
     * @param {RichLogootSOperationMsg} message RichLogootSOperationMsg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RichLogootSOperationMsg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = 0;
            object.clock = 0;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.clock != null && message.hasOwnProperty("clock"))
            object.clock = message.clock;
        if (message.logootSAddMsg != null && message.hasOwnProperty("logootSAddMsg")) {
            object.logootSAddMsg = $root.LogootSAddMsg.toObject(message.logootSAddMsg, options);
            if (options.oneofs)
                object.type = "logootSAddMsg";
        }
        if (message.logootSDelMsg != null && message.hasOwnProperty("logootSDelMsg")) {
            object.logootSDelMsg = $root.LogootSDelMsg.toObject(message.logootSDelMsg, options);
            if (options.oneofs)
                object.type = "logootSDelMsg";
        }
        return object;
    };

    /**
     * Converts this RichLogootSOperationMsg to JSON.
     * @function toJSON
     * @memberof RichLogootSOperationMsg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RichLogootSOperationMsg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RichLogootSOperationMsg;
})();

export const LogootSAddMsg = $root.LogootSAddMsg = (() => {

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
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
     * Encodes the specified LogootSAddMsg message, length delimited. Does not implicitly {@link LogootSAddMsg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LogootSAddMsg
     * @static
     * @param {ILogootSAddMsg} message LogootSAddMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogootSAddMsg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
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
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogootSAddMsg();
        while (reader.pos < end) {
            let tag = reader.uint32();
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

    /**
     * Decodes a LogootSAddMsg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LogootSAddMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LogootSAddMsg} LogootSAddMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogootSAddMsg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LogootSAddMsg message.
     * @function verify
     * @memberof LogootSAddMsg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LogootSAddMsg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id")) {
            let error = $root.IdentifierMsg.verify(message.id);
            if (error)
                return "id." + error;
        }
        if (message.content != null && message.hasOwnProperty("content"))
            if (!$util.isString(message.content))
                return "content: string expected";
        return null;
    };

    /**
     * Creates a LogootSAddMsg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LogootSAddMsg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LogootSAddMsg} LogootSAddMsg
     */
    LogootSAddMsg.fromObject = function fromObject(object) {
        if (object instanceof $root.LogootSAddMsg)
            return object;
        let message = new $root.LogootSAddMsg();
        if (object.id != null) {
            if (typeof object.id !== "object")
                throw TypeError(".LogootSAddMsg.id: object expected");
            message.id = $root.IdentifierMsg.fromObject(object.id);
        }
        if (object.content != null)
            message.content = String(object.content);
        return message;
    };

    /**
     * Creates a plain object from a LogootSAddMsg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LogootSAddMsg
     * @static
     * @param {LogootSAddMsg} message LogootSAddMsg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LogootSAddMsg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = null;
            object.content = "";
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = $root.IdentifierMsg.toObject(message.id, options);
        if (message.content != null && message.hasOwnProperty("content"))
            object.content = message.content;
        return object;
    };

    /**
     * Converts this LogootSAddMsg to JSON.
     * @function toJSON
     * @memberof LogootSAddMsg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LogootSAddMsg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LogootSAddMsg;
})();

export const IdentifierMsg = $root.IdentifierMsg = (() => {

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
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            for (let i = 0; i < message.base.length; ++i)
                writer.int32(message.base[i]);
            writer.ldelim();
        }
        if (message.last != null && message.hasOwnProperty("last"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.last);
        return writer;
    };

    /**
     * Encodes the specified IdentifierMsg message, length delimited. Does not implicitly {@link IdentifierMsg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof IdentifierMsg
     * @static
     * @param {IIdentifierMsg} message IdentifierMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    IdentifierMsg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
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
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.IdentifierMsg();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.base && message.base.length))
                    message.base = [];
                if ((tag & 7) === 2) {
                    let end2 = reader.uint32() + reader.pos;
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

    /**
     * Decodes an IdentifierMsg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof IdentifierMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {IdentifierMsg} IdentifierMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    IdentifierMsg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an IdentifierMsg message.
     * @function verify
     * @memberof IdentifierMsg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    IdentifierMsg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.base != null && message.hasOwnProperty("base")) {
            if (!Array.isArray(message.base))
                return "base: array expected";
            for (let i = 0; i < message.base.length; ++i)
                if (!$util.isInteger(message.base[i]))
                    return "base: integer[] expected";
        }
        if (message.last != null && message.hasOwnProperty("last"))
            if (!$util.isInteger(message.last))
                return "last: integer expected";
        return null;
    };

    /**
     * Creates an IdentifierMsg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof IdentifierMsg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {IdentifierMsg} IdentifierMsg
     */
    IdentifierMsg.fromObject = function fromObject(object) {
        if (object instanceof $root.IdentifierMsg)
            return object;
        let message = new $root.IdentifierMsg();
        if (object.base) {
            if (!Array.isArray(object.base))
                throw TypeError(".IdentifierMsg.base: array expected");
            message.base = [];
            for (let i = 0; i < object.base.length; ++i)
                message.base[i] = object.base[i] | 0;
        }
        if (object.last != null)
            message.last = object.last | 0;
        return message;
    };

    /**
     * Creates a plain object from an IdentifierMsg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof IdentifierMsg
     * @static
     * @param {IdentifierMsg} message IdentifierMsg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    IdentifierMsg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.base = [];
        if (options.defaults)
            object.last = 0;
        if (message.base && message.base.length) {
            object.base = [];
            for (let j = 0; j < message.base.length; ++j)
                object.base[j] = message.base[j];
        }
        if (message.last != null && message.hasOwnProperty("last"))
            object.last = message.last;
        return object;
    };

    /**
     * Converts this IdentifierMsg to JSON.
     * @function toJSON
     * @memberof IdentifierMsg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    IdentifierMsg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return IdentifierMsg;
})();

export const LogootSDelMsg = $root.LogootSDelMsg = (() => {

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
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            for (let i = 0; i < message.lid.length; ++i)
                $root.IdentifierIntervalMsg.encode(message.lid[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified LogootSDelMsg message, length delimited. Does not implicitly {@link LogootSDelMsg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LogootSDelMsg
     * @static
     * @param {ILogootSDelMsg} message LogootSDelMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogootSDelMsg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
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
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogootSDelMsg();
        while (reader.pos < end) {
            let tag = reader.uint32();
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

    /**
     * Decodes a LogootSDelMsg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LogootSDelMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LogootSDelMsg} LogootSDelMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogootSDelMsg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LogootSDelMsg message.
     * @function verify
     * @memberof LogootSDelMsg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LogootSDelMsg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.lid != null && message.hasOwnProperty("lid")) {
            if (!Array.isArray(message.lid))
                return "lid: array expected";
            for (let i = 0; i < message.lid.length; ++i) {
                let error = $root.IdentifierIntervalMsg.verify(message.lid[i]);
                if (error)
                    return "lid." + error;
            }
        }
        return null;
    };

    /**
     * Creates a LogootSDelMsg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LogootSDelMsg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LogootSDelMsg} LogootSDelMsg
     */
    LogootSDelMsg.fromObject = function fromObject(object) {
        if (object instanceof $root.LogootSDelMsg)
            return object;
        let message = new $root.LogootSDelMsg();
        if (object.lid) {
            if (!Array.isArray(object.lid))
                throw TypeError(".LogootSDelMsg.lid: array expected");
            message.lid = [];
            for (let i = 0; i < object.lid.length; ++i) {
                if (typeof object.lid[i] !== "object")
                    throw TypeError(".LogootSDelMsg.lid: object expected");
                message.lid[i] = $root.IdentifierIntervalMsg.fromObject(object.lid[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a LogootSDelMsg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LogootSDelMsg
     * @static
     * @param {LogootSDelMsg} message LogootSDelMsg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LogootSDelMsg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.lid = [];
        if (message.lid && message.lid.length) {
            object.lid = [];
            for (let j = 0; j < message.lid.length; ++j)
                object.lid[j] = $root.IdentifierIntervalMsg.toObject(message.lid[j], options);
        }
        return object;
    };

    /**
     * Converts this LogootSDelMsg to JSON.
     * @function toJSON
     * @memberof LogootSDelMsg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LogootSDelMsg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LogootSDelMsg;
})();

export const IdentifierIntervalMsg = $root.IdentifierIntervalMsg = (() => {

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
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            for (let i = 0; i < message.base.length; ++i)
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
     * Encodes the specified IdentifierIntervalMsg message, length delimited. Does not implicitly {@link IdentifierIntervalMsg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof IdentifierIntervalMsg
     * @static
     * @param {IIdentifierIntervalMsg} message IdentifierIntervalMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    IdentifierIntervalMsg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
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
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.IdentifierIntervalMsg();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.base && message.base.length))
                    message.base = [];
                if ((tag & 7) === 2) {
                    let end2 = reader.uint32() + reader.pos;
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

    /**
     * Decodes an IdentifierIntervalMsg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof IdentifierIntervalMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {IdentifierIntervalMsg} IdentifierIntervalMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    IdentifierIntervalMsg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an IdentifierIntervalMsg message.
     * @function verify
     * @memberof IdentifierIntervalMsg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    IdentifierIntervalMsg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.base != null && message.hasOwnProperty("base")) {
            if (!Array.isArray(message.base))
                return "base: array expected";
            for (let i = 0; i < message.base.length; ++i)
                if (!$util.isInteger(message.base[i]))
                    return "base: integer[] expected";
        }
        if (message.begin != null && message.hasOwnProperty("begin"))
            if (!$util.isInteger(message.begin))
                return "begin: integer expected";
        if (message.end != null && message.hasOwnProperty("end"))
            if (!$util.isInteger(message.end))
                return "end: integer expected";
        return null;
    };

    /**
     * Creates an IdentifierIntervalMsg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof IdentifierIntervalMsg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {IdentifierIntervalMsg} IdentifierIntervalMsg
     */
    IdentifierIntervalMsg.fromObject = function fromObject(object) {
        if (object instanceof $root.IdentifierIntervalMsg)
            return object;
        let message = new $root.IdentifierIntervalMsg();
        if (object.base) {
            if (!Array.isArray(object.base))
                throw TypeError(".IdentifierIntervalMsg.base: array expected");
            message.base = [];
            for (let i = 0; i < object.base.length; ++i)
                message.base[i] = object.base[i] | 0;
        }
        if (object.begin != null)
            message.begin = object.begin | 0;
        if (object.end != null)
            message.end = object.end | 0;
        return message;
    };

    /**
     * Creates a plain object from an IdentifierIntervalMsg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof IdentifierIntervalMsg
     * @static
     * @param {IdentifierIntervalMsg} message IdentifierIntervalMsg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    IdentifierIntervalMsg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.base = [];
        if (options.defaults) {
            object.begin = 0;
            object.end = 0;
        }
        if (message.base && message.base.length) {
            object.base = [];
            for (let j = 0; j < message.base.length; ++j)
                object.base[j] = message.base[j];
        }
        if (message.begin != null && message.hasOwnProperty("begin"))
            object.begin = message.begin;
        if (message.end != null && message.hasOwnProperty("end"))
            object.end = message.end;
        return object;
    };

    /**
     * Converts this IdentifierIntervalMsg to JSON.
     * @function toJSON
     * @memberof IdentifierIntervalMsg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    IdentifierIntervalMsg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return IdentifierIntervalMsg;
})();

export const QuerySync = $root.QuerySync = (() => {

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
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            for (let keys = Object.keys(message.vector), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 0 =*/8).int32(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.vector[keys[i]]).ldelim();
        return writer;
    };

    /**
     * Encodes the specified QuerySync message, length delimited. Does not implicitly {@link QuerySync.verify|verify} messages.
     * @function encodeDelimited
     * @memberof QuerySync
     * @static
     * @param {IQuerySync} message QuerySync message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    QuerySync.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
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
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.QuerySync(), key;
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

    /**
     * Decodes a QuerySync message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof QuerySync
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {QuerySync} QuerySync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    QuerySync.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a QuerySync message.
     * @function verify
     * @memberof QuerySync
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    QuerySync.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.vector != null && message.hasOwnProperty("vector")) {
            if (!$util.isObject(message.vector))
                return "vector: object expected";
            let key = Object.keys(message.vector);
            for (let i = 0; i < key.length; ++i) {
                if (!$util.key32Re.test(key[i]))
                    return "vector: integer key{k:int32} expected";
                if (!$util.isInteger(message.vector[key[i]]))
                    return "vector: integer{k:int32} expected";
            }
        }
        return null;
    };

    /**
     * Creates a QuerySync message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof QuerySync
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {QuerySync} QuerySync
     */
    QuerySync.fromObject = function fromObject(object) {
        if (object instanceof $root.QuerySync)
            return object;
        let message = new $root.QuerySync();
        if (object.vector) {
            if (typeof object.vector !== "object")
                throw TypeError(".QuerySync.vector: object expected");
            message.vector = {};
            for (let keys = Object.keys(object.vector), i = 0; i < keys.length; ++i)
                message.vector[keys[i]] = object.vector[keys[i]] | 0;
        }
        return message;
    };

    /**
     * Creates a plain object from a QuerySync message. Also converts values to other types if specified.
     * @function toObject
     * @memberof QuerySync
     * @static
     * @param {QuerySync} message QuerySync
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    QuerySync.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.objects || options.defaults)
            object.vector = {};
        let keys2;
        if (message.vector && (keys2 = Object.keys(message.vector)).length) {
            object.vector = {};
            for (let j = 0; j < keys2.length; ++j)
                object.vector[keys2[j]] = message.vector[keys2[j]];
        }
        return object;
    };

    /**
     * Converts this QuerySync to JSON.
     * @function toJSON
     * @memberof QuerySync
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    QuerySync.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return QuerySync;
})();

export const ReplySync = $root.ReplySync = (() => {

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
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            for (let i = 0; i < message.richLogootSOpsMsg.length; ++i)
                $root.RichLogootSOperationMsg.encode(message.richLogootSOpsMsg[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.intervals != null && message.intervals.length)
            for (let i = 0; i < message.intervals.length; ++i)
                $root.IntervalMsg.encode(message.intervals[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ReplySync message, length delimited. Does not implicitly {@link ReplySync.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ReplySync
     * @static
     * @param {IReplySync} message ReplySync message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ReplySync.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
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
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ReplySync();
        while (reader.pos < end) {
            let tag = reader.uint32();
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

    /**
     * Decodes a ReplySync message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ReplySync
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ReplySync} ReplySync
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ReplySync.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ReplySync message.
     * @function verify
     * @memberof ReplySync
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ReplySync.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.richLogootSOpsMsg != null && message.hasOwnProperty("richLogootSOpsMsg")) {
            if (!Array.isArray(message.richLogootSOpsMsg))
                return "richLogootSOpsMsg: array expected";
            for (let i = 0; i < message.richLogootSOpsMsg.length; ++i) {
                let error = $root.RichLogootSOperationMsg.verify(message.richLogootSOpsMsg[i]);
                if (error)
                    return "richLogootSOpsMsg." + error;
            }
        }
        if (message.intervals != null && message.hasOwnProperty("intervals")) {
            if (!Array.isArray(message.intervals))
                return "intervals: array expected";
            for (let i = 0; i < message.intervals.length; ++i) {
                error = $root.IntervalMsg.verify(message.intervals[i]);
                if (error)
                    return "intervals." + error;
            }
        }
        return null;
    };

    /**
     * Creates a ReplySync message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ReplySync
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ReplySync} ReplySync
     */
    ReplySync.fromObject = function fromObject(object) {
        if (object instanceof $root.ReplySync)
            return object;
        let message = new $root.ReplySync();
        if (object.richLogootSOpsMsg) {
            if (!Array.isArray(object.richLogootSOpsMsg))
                throw TypeError(".ReplySync.richLogootSOpsMsg: array expected");
            message.richLogootSOpsMsg = [];
            for (let i = 0; i < object.richLogootSOpsMsg.length; ++i) {
                if (typeof object.richLogootSOpsMsg[i] !== "object")
                    throw TypeError(".ReplySync.richLogootSOpsMsg: object expected");
                message.richLogootSOpsMsg[i] = $root.RichLogootSOperationMsg.fromObject(object.richLogootSOpsMsg[i]);
            }
        }
        if (object.intervals) {
            if (!Array.isArray(object.intervals))
                throw TypeError(".ReplySync.intervals: array expected");
            message.intervals = [];
            for (let i = 0; i < object.intervals.length; ++i) {
                if (typeof object.intervals[i] !== "object")
                    throw TypeError(".ReplySync.intervals: object expected");
                message.intervals[i] = $root.IntervalMsg.fromObject(object.intervals[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a ReplySync message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ReplySync
     * @static
     * @param {ReplySync} message ReplySync
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ReplySync.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults) {
            object.richLogootSOpsMsg = [];
            object.intervals = [];
        }
        if (message.richLogootSOpsMsg && message.richLogootSOpsMsg.length) {
            object.richLogootSOpsMsg = [];
            for (let j = 0; j < message.richLogootSOpsMsg.length; ++j)
                object.richLogootSOpsMsg[j] = $root.RichLogootSOperationMsg.toObject(message.richLogootSOpsMsg[j], options);
        }
        if (message.intervals && message.intervals.length) {
            object.intervals = [];
            for (let j = 0; j < message.intervals.length; ++j)
                object.intervals[j] = $root.IntervalMsg.toObject(message.intervals[j], options);
        }
        return object;
    };

    /**
     * Converts this ReplySync to JSON.
     * @function toJSON
     * @memberof ReplySync
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ReplySync.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ReplySync;
})();

export const IntervalMsg = $root.IntervalMsg = (() => {

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
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
     * Encodes the specified IntervalMsg message, length delimited. Does not implicitly {@link IntervalMsg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof IntervalMsg
     * @static
     * @param {IIntervalMsg} message IntervalMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    IntervalMsg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
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
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.IntervalMsg();
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

    /**
     * Decodes an IntervalMsg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof IntervalMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {IntervalMsg} IntervalMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    IntervalMsg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an IntervalMsg message.
     * @function verify
     * @memberof IntervalMsg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    IntervalMsg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isInteger(message.id))
                return "id: integer expected";
        if (message.begin != null && message.hasOwnProperty("begin"))
            if (!$util.isInteger(message.begin))
                return "begin: integer expected";
        if (message.end != null && message.hasOwnProperty("end"))
            if (!$util.isInteger(message.end))
                return "end: integer expected";
        return null;
    };

    /**
     * Creates an IntervalMsg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof IntervalMsg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {IntervalMsg} IntervalMsg
     */
    IntervalMsg.fromObject = function fromObject(object) {
        if (object instanceof $root.IntervalMsg)
            return object;
        let message = new $root.IntervalMsg();
        if (object.id != null)
            message.id = object.id | 0;
        if (object.begin != null)
            message.begin = object.begin | 0;
        if (object.end != null)
            message.end = object.end | 0;
        return message;
    };

    /**
     * Creates a plain object from an IntervalMsg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof IntervalMsg
     * @static
     * @param {IntervalMsg} message IntervalMsg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    IntervalMsg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = 0;
            object.begin = 0;
            object.end = 0;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.begin != null && message.hasOwnProperty("begin"))
            object.begin = message.begin;
        if (message.end != null && message.hasOwnProperty("end"))
            object.end = message.end;
        return object;
    };

    /**
     * Converts this IntervalMsg to JSON.
     * @function toJSON
     * @memberof IntervalMsg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    IntervalMsg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return IntervalMsg;
})();

export { $root as default };

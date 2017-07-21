/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const CollaboratorMsg = $root.CollaboratorMsg = (() => {

    /**
     * Properties of a CollaboratorMsg.
     * @exports ICollaboratorMsg
     * @interface ICollaboratorMsg
     * @property {string} [pseudo] CollaboratorMsg pseudo
     */

    /**
     * Constructs a new CollaboratorMsg.
     * @exports CollaboratorMsg
     * @classdesc Represents a CollaboratorMsg.
     * @constructor
     * @param {ICollaboratorMsg=} [properties] Properties to set
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
     * @memberof CollaboratorMsg
     * @instance
     */
    CollaboratorMsg.prototype.pseudo = "";

    /**
     * Creates a new CollaboratorMsg instance using the specified properties.
     * @function create
     * @memberof CollaboratorMsg
     * @static
     * @param {ICollaboratorMsg=} [properties] Properties to set
     * @returns {CollaboratorMsg} CollaboratorMsg instance
     */
    CollaboratorMsg.create = function create(properties) {
        return new CollaboratorMsg(properties);
    };

    /**
     * Encodes the specified CollaboratorMsg message. Does not implicitly {@link CollaboratorMsg.verify|verify} messages.
     * @function encode
     * @memberof CollaboratorMsg
     * @static
     * @param {ICollaboratorMsg} message CollaboratorMsg message or plain object to encode
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
     * Encodes the specified CollaboratorMsg message, length delimited. Does not implicitly {@link CollaboratorMsg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CollaboratorMsg
     * @static
     * @param {ICollaboratorMsg} message CollaboratorMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CollaboratorMsg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CollaboratorMsg message from the specified reader or buffer.
     * @function decode
     * @memberof CollaboratorMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CollaboratorMsg} CollaboratorMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CollaboratorMsg.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CollaboratorMsg();
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

    /**
     * Decodes a CollaboratorMsg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CollaboratorMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CollaboratorMsg} CollaboratorMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CollaboratorMsg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CollaboratorMsg message.
     * @function verify
     * @memberof CollaboratorMsg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CollaboratorMsg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.pseudo != null && message.hasOwnProperty("pseudo"))
            if (!$util.isString(message.pseudo))
                return "pseudo: string expected";
        return null;
    };

    /**
     * Creates a CollaboratorMsg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CollaboratorMsg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CollaboratorMsg} CollaboratorMsg
     */
    CollaboratorMsg.fromObject = function fromObject(object) {
        if (object instanceof $root.CollaboratorMsg)
            return object;
        let message = new $root.CollaboratorMsg();
        if (object.pseudo != null)
            message.pseudo = String(object.pseudo);
        return message;
    };

    /**
     * Creates a plain object from a CollaboratorMsg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CollaboratorMsg
     * @static
     * @param {CollaboratorMsg} message CollaboratorMsg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CollaboratorMsg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.pseudo = "";
        if (message.pseudo != null && message.hasOwnProperty("pseudo"))
            object.pseudo = message.pseudo;
        return object;
    };

    /**
     * Converts this CollaboratorMsg to JSON.
     * @function toJSON
     * @memberof CollaboratorMsg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CollaboratorMsg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CollaboratorMsg;
})();

export { $root as default };

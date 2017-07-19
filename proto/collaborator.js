/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Collaborator = $root.Collaborator = (() => {

    /**
     * Properties of a Collaborator.
     * @exports ICollaborator
     * @interface ICollaborator
     * @property {string} [pseudo] Collaborator pseudo
     */

    /**
     * Constructs a new Collaborator.
     * @exports Collaborator
     * @classdesc Represents a Collaborator.
     * @constructor
     * @param {ICollaborator=} [properties] Properties to set
     */
    function Collaborator(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Collaborator pseudo.
     * @member {string}pseudo
     * @memberof Collaborator
     * @instance
     */
    Collaborator.prototype.pseudo = "";

    /**
     * Creates a new Collaborator instance using the specified properties.
     * @function create
     * @memberof Collaborator
     * @static
     * @param {ICollaborator=} [properties] Properties to set
     * @returns {Collaborator} Collaborator instance
     */
    Collaborator.create = function create(properties) {
        return new Collaborator(properties);
    };

    /**
     * Encodes the specified Collaborator message. Does not implicitly {@link Collaborator.verify|verify} messages.
     * @function encode
     * @memberof Collaborator
     * @static
     * @param {ICollaborator} message Collaborator message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Collaborator.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.pseudo != null && message.hasOwnProperty("pseudo"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.pseudo);
        return writer;
    };

    /**
     * Encodes the specified Collaborator message, length delimited. Does not implicitly {@link Collaborator.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Collaborator
     * @static
     * @param {ICollaborator} message Collaborator message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Collaborator.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Collaborator message from the specified reader or buffer.
     * @function decode
     * @memberof Collaborator
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Collaborator} Collaborator
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Collaborator.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Collaborator();
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
     * Decodes a Collaborator message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Collaborator
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Collaborator} Collaborator
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Collaborator.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Collaborator message.
     * @function verify
     * @memberof Collaborator
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Collaborator.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.pseudo != null && message.hasOwnProperty("pseudo"))
            if (!$util.isString(message.pseudo))
                return "pseudo: string expected";
        return null;
    };

    /**
     * Creates a Collaborator message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Collaborator
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Collaborator} Collaborator
     */
    Collaborator.fromObject = function fromObject(object) {
        if (object instanceof $root.Collaborator)
            return object;
        let message = new $root.Collaborator();
        if (object.pseudo != null)
            message.pseudo = String(object.pseudo);
        return message;
    };

    /**
     * Creates a plain object from a Collaborator message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Collaborator
     * @static
     * @param {Collaborator} message Collaborator
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Collaborator.toObject = function toObject(message, options) {
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
     * Converts this Collaborator to JSON.
     * @function toJSON
     * @memberof Collaborator
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Collaborator.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Collaborator;
})();

export { $root as default };

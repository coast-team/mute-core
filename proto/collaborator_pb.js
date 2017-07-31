/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.CollaboratorMsg = (function() {

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
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CollaboratorMsg();
        while (reader.pos < end) {
            var tag = reader.uint32();
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

module.exports = $root;

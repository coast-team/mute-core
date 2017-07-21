import * as $protobuf from "protobufjs";

/** Properties of a CollaboratorMsg. */
export interface ICollaboratorMsg {

    /** CollaboratorMsg pseudo */
    pseudo?: string;
}

/** Represents a CollaboratorMsg. */
export class CollaboratorMsg {

    /**
     * Constructs a new CollaboratorMsg.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICollaboratorMsg);

    /** CollaboratorMsg pseudo. */
    public pseudo: string;

    /**
     * Creates a new CollaboratorMsg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CollaboratorMsg instance
     */
    public static create(properties?: ICollaboratorMsg): CollaboratorMsg;

    /**
     * Encodes the specified CollaboratorMsg message. Does not implicitly {@link CollaboratorMsg.verify|verify} messages.
     * @param message CollaboratorMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICollaboratorMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CollaboratorMsg message, length delimited. Does not implicitly {@link CollaboratorMsg.verify|verify} messages.
     * @param message CollaboratorMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICollaboratorMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CollaboratorMsg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CollaboratorMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CollaboratorMsg;

    /**
     * Decodes a CollaboratorMsg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CollaboratorMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CollaboratorMsg;

    /**
     * Verifies a CollaboratorMsg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CollaboratorMsg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CollaboratorMsg
     */
    public static fromObject(object: { [k: string]: any }): CollaboratorMsg;

    /**
     * Creates a plain object from a CollaboratorMsg message. Also converts values to other types if specified.
     * @param message CollaboratorMsg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CollaboratorMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CollaboratorMsg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

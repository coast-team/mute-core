import * as $protobuf from "protobufjs";

/** Properties of a Collaborator. */
export interface ICollaborator {

    /** Collaborator pseudo */
    pseudo?: string;
}

/** Represents a Collaborator. */
export class Collaborator {

    /**
     * Constructs a new Collaborator.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICollaborator);

    /** Collaborator pseudo. */
    public pseudo: string;

    /**
     * Creates a new Collaborator instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Collaborator instance
     */
    public static create(properties?: ICollaborator): Collaborator;

    /**
     * Encodes the specified Collaborator message. Does not implicitly {@link Collaborator.verify|verify} messages.
     * @param message Collaborator message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICollaborator, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Collaborator message, length delimited. Does not implicitly {@link Collaborator.verify|verify} messages.
     * @param message Collaborator message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICollaborator, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Collaborator message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Collaborator
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Collaborator;

    /**
     * Decodes a Collaborator message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Collaborator
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Collaborator;

    /**
     * Verifies a Collaborator message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Collaborator message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Collaborator
     */
    public static fromObject(object: { [k: string]: any }): Collaborator;

    /**
     * Creates a plain object from a Collaborator message. Also converts values to other types if specified.
     * @param message Collaborator
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Collaborator, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Collaborator to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

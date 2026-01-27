import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    content: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    image?: string | null;
    replyingTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    content: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    image?: string | null;
    replyingTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    content: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    image?: string | null;
    replyingTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    content: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    image?: string | null;
    replyingTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    content: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    image?: string | null;
    replyingTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    content: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    image?: string | null;
    replyingTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        content: string;
        thread: mongoose.Types.ObjectId;
        sender: mongoose.Types.ObjectId;
        image?: string | null;
        replyingTo?: mongoose.Types.ObjectId | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        content: string;
        thread: mongoose.Types.ObjectId;
        sender: mongoose.Types.ObjectId;
        image?: string | null;
        replyingTo?: mongoose.Types.ObjectId | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    content: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    image?: string | null;
    replyingTo?: mongoose.Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    content: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    image?: string | null;
    replyingTo?: mongoose.Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=Message.d.ts.map
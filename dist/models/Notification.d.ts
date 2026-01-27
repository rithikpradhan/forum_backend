import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    type: "reply" | "mention" | "like";
    message: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    threadTitle: string;
    read: boolean;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    type: "reply" | "mention" | "like";
    message: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    threadTitle: string;
    read: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    type: "reply" | "mention" | "like";
    message: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    threadTitle: string;
    read: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "reply" | "mention" | "like";
    message: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    threadTitle: string;
    read: boolean;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    type: "reply" | "mention" | "like";
    message: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    threadTitle: string;
    read: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    type: "reply" | "mention" | "like";
    message: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    threadTitle: string;
    read: boolean;
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
        type: "reply" | "mention" | "like";
        message: string;
        thread: mongoose.Types.ObjectId;
        sender: mongoose.Types.ObjectId;
        recipient: mongoose.Types.ObjectId;
        threadTitle: string;
        read: boolean;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        type: "reply" | "mention" | "like";
        message: string;
        thread: mongoose.Types.ObjectId;
        sender: mongoose.Types.ObjectId;
        recipient: mongoose.Types.ObjectId;
        threadTitle: string;
        read: boolean;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    type: "reply" | "mention" | "like";
    message: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    threadTitle: string;
    read: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    type: "reply" | "mention" | "like";
    message: string;
    thread: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    threadTitle: string;
    read: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=Notification.d.ts.map
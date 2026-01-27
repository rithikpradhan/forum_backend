import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    title: string;
    content: string;
    category: "Discussion" | "Question" | "Announcement" | "Tutorial" | "Showcase";
    author: mongoose.Types.ObjectId;
    view: number;
    replies: number;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    title: string;
    content: string;
    category: "Discussion" | "Question" | "Announcement" | "Tutorial" | "Showcase";
    author: mongoose.Types.ObjectId;
    view: number;
    replies: number;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    title: string;
    content: string;
    category: "Discussion" | "Question" | "Announcement" | "Tutorial" | "Showcase";
    author: mongoose.Types.ObjectId;
    view: number;
    replies: number;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    content: string;
    category: "Discussion" | "Question" | "Announcement" | "Tutorial" | "Showcase";
    author: mongoose.Types.ObjectId;
    view: number;
    replies: number;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    title: string;
    content: string;
    category: "Discussion" | "Question" | "Announcement" | "Tutorial" | "Showcase";
    author: mongoose.Types.ObjectId;
    view: number;
    replies: number;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    title: string;
    content: string;
    category: "Discussion" | "Question" | "Announcement" | "Tutorial" | "Showcase";
    author: mongoose.Types.ObjectId;
    view: number;
    replies: number;
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
        title: string;
        content: string;
        category: "Discussion" | "Question" | "Announcement" | "Tutorial" | "Showcase";
        author: mongoose.Types.ObjectId;
        view: number;
        replies: number;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        title: string;
        content: string;
        category: "Discussion" | "Question" | "Announcement" | "Tutorial" | "Showcase";
        author: mongoose.Types.ObjectId;
        view: number;
        replies: number;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    title: string;
    content: string;
    category: "Discussion" | "Question" | "Announcement" | "Tutorial" | "Showcase";
    author: mongoose.Types.ObjectId;
    view: number;
    replies: number;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    title: string;
    content: string;
    category: "Discussion" | "Question" | "Announcement" | "Tutorial" | "Showcase";
    author: mongoose.Types.ObjectId;
    view: number;
    replies: number;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=Thread.d.ts.map
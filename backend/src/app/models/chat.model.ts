import mongoose from 'mongoose'

const Schema = mongoose.Schema

const chatSchema = new Schema(
  {
    /**
     * The users that are in this chat. For now we will only allow 2 users per chat.
     */
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [
      new Schema(
        {
          sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          content: { type: String, required: true },
        },
        { timestamps: true }
      ),
    ],
    lastRead: {
      type: Map,
      of: new Schema({
        messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
        readAt: { type: Date, required: true },
      }),
      default: {},
      required: true,
    },
  },

  { timestamps: true }
)

export type ChatDocument = mongoose.HydratedDocument<
  mongoose.InferSchemaType<typeof chatSchema>
>

export const ChatModel = mongoose.model('Chat', chatSchema)

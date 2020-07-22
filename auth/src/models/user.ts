import mongoose from 'mongoose';
import { Password } from '../services/password';

// For Issue #1
// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}
// An interface that describes the properties
// that a User Mode has
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

// For Issue #2
// An interface that describes the properties
// that a User Document has
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
// Define the Pre middleware for Save event
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }

  next();
});
// Define the custom static method - build()
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
// Define the User Model
const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

// Export Model
export { User };

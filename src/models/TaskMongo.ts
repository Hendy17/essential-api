import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  userId: mongoose.Types.ObjectId;
  tags?: string[];
  category?: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character'],
    maxlength: [255, 'Title must not exceed 255 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description must not exceed 1000 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value >= new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag must not exceed 20 characters']
  }],
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category must not exceed 50 characters']
  },
  attachments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete (ret as any).__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ 
  title: 'text', 
  description: 'text' 
}, {
  weights: {
    title: 10,
    description: 5
  }
});

taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && !this.completed;
});

taskSchema.pre('save', async function(next) {
  if (this.isModified('userId')) {
    const User = mongoose.model('User');
    const user = await User.findById(this.userId);
    if (!user) {
      return next(new Error('User not found'));
    }
  }
  next();
});

export const Task = mongoose.model<ITask>('Task', taskSchema);
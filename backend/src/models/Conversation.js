import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  assistantId: {
    type: String,
    required: true,
    enum: ['stark', 'cap', 'spidey'],
    index: true
  },
  userId: {
    type: String,
    required: false,
    index: true
  },
  messages: [{
    id: String,
    text: String,
    sender: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      intent: String,
      confidence: Number,
      entities: [mongoose.Schema.Types.Mixed],
      responseTime: Number
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'error'],
    default: 'active'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  duration: Number, // en segundos
  satisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    timestamp: Date
  },
  tags: [String],
  resolved: {
    type: Boolean,
    default: false
  },
  escalated: {
    type: Boolean,
    default: false
  },
  metadata: {
    userAgent: String,
    ip: String,
    referrer: String,
    language: String,
    timezone: String
  }
}, {
  timestamps: true,
  collection: 'conversations'
});

// Índices para optimizar consultas
conversationSchema.index({ assistantId: 1, createdAt: -1 });
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ status: 1, createdAt: -1 });
conversationSchema.index({ 'satisfaction.rating': 1 });

// Middleware pre-save para calcular duración
conversationSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

// Métodos del modelo
conversationSchema.methods.addMessage = function(messageData) {
  this.messages.push({
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...messageData
  });
  return this.save();
};

conversationSchema.methods.endConversation = function(satisfaction = null) {
  this.status = 'completed';
  this.endTime = new Date();
  if (satisfaction) {
    this.satisfaction = {
      ...satisfaction,
      timestamp: new Date()
    };
  }
  return this.save();
};

conversationSchema.statics.getAnalytics = function(assistantId, timeRange = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeRange);

  return this.aggregate([
    {
      $match: {
        assistantId: assistantId || { $in: ['stark', 'cap', 'spidey'] },
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$assistantId',
        totalConversations: { $sum: 1 },
        completedConversations: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        averageRating: { $avg: '$satisfaction.rating' },
        averageDuration: { $avg: '$duration' },
        totalMessages: { $sum: { $size: '$messages' } },
        resolvedIssues: {
          $sum: { $cond: ['$resolved', 1, 0] }
        },
        escalatedIssues: {
          $sum: { $cond: ['$escalated', 1, 0] }
        }
      }
    }
  ]);
};

export const Conversation = mongoose.model('Conversation', conversationSchema);

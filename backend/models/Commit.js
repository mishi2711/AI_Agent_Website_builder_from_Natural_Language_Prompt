import mongoose from 'mongoose';

const commitSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true,
    },
    commitHash: {
        type: String,
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index for efficient queries
commitSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.model('Commit', commitSchema);

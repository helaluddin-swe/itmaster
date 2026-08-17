import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from "../../context/AppContext";
import { MessageSquareReply, Send, Loader2 } from 'lucide-react';

const CommentSection = ({ partId }) => {
    const { fetchComments, addComment, replyComment, userData } = useAppContext();
    
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Track which comment ID currently has an active reply input box open
    const [replyingToId, setReplyingToId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const loadComments = useCallback(async () => {
        if (!partId) return;
        setIsLoading(true);
        try {
            const response = await fetchComments(partId);
            
            // Handle different possible backend response structures safely
            let commentsArray = [];
            if (Array.isArray(response)) {
                commentsArray = response;
            } else if (response && Array.isArray(response.data)) {
                commentsArray = response.data;
            } else if (response && Array.isArray(response.comments)) {
                commentsArray = response.comments;
            }

            setComments(commentsArray);
        } catch (err) {
            console.error("Failed to load comments", err);
            setComments([]);
        } finally {
            setIsLoading(false);
        }
    }, [partId, fetchComments]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim() || !partId) return;

        setIsSubmitting(true);
        const res = await addComment(partId, newCommentText.trim());
        
        if (res && (res.success === true || res._id || res.comment)) {
            setNewCommentText("");
            loadComments();
        } else {
            alert(res?.message || "Failed to post comment");
        }
        setIsSubmitting(false);
    };

    const handleAddReply = async (commentId) => {
        if (!replyText.trim()) return;

        setIsSubmittingReply(true);
        const res = await replyComment(commentId, replyText.trim());

        if (res && (res.success === true || res.message)) {
            setReplyText("");
            setReplyingToId(null);
            loadComments();
        } else {
            alert(res?.message || "Failed to post reply");
        }
        setIsSubmittingReply(false);
    };

    const userRole = userData?.role?.toLowerCase() || '';
    const isAdminOrMod = userRole === 'admin' || userRole === 'moderator';
    const canReply = isAdminOrMod || !!userData; // Anyone logged in can reply

    return (
        <div className="mt-8 border-t border-slate-800 pt-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4">
                Discussion & Feedback {comments.length > 0 && `(${comments.length})`}
            </h3>

            {/* Comment Form */}
            {userData ? (
                <form onSubmit={handleAddComment} className="mb-6 space-y-3">
                    <textarea
                        rows="3"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write your thoughts or ask a question..."
                        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                            {isSubmitting ? "Posting..." : "Post Comment"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="p-4 mb-6 rounded-lg bg-slate-900/50 border border-slate-800 text-center text-slate-400 text-sm">
                    Please log in to participate in the discussion.
                </div>
            )}

            {/* Comment List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-6 text-slate-500 text-xs tracking-widest uppercase animate-pulse">
                        Loading comments...
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div 
                            key={comment._id || comment.id} 
                            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3 transition-all hover:border-slate-700"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-200 text-sm">
                                        {comment.userId?.name || comment.user?.name || "Anonymous User"}
                                    </span>
                                    {(comment.userId?.role === 'admin' || comment.user?.role === 'admin') && (
                                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-500">
                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : 'Recent'}
                                </span>
                            </div>
                            <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                                {comment.text}
                            </p>

                            {/* Nested Replies Display */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="pl-4 mt-3 border-l-2 border-indigo-500/30 space-y-3">
                                    {comment.replies.map((reply, idx) => (
                                        <div key={reply._id || idx} className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/50 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-xs text-slate-300">
                                                        {reply.userId?.name || reply.user?.name || "User"}
                                                    </span>
                                                    {(reply.userId?.role === 'admin' || reply.user?.role === 'admin') && (
                                                        <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-500">
                                                    {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                                                </span>
                                            </div>
                                            <p className="text-slate-300 text-xs whitespace-pre-wrap">
                                                {reply.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reply Action Trigger */}
                            {canReply && (
                                <div className="pt-2 flex justify-end">
                                    <button
                                        onClick={() => {
                                            setReplyingToId(replyingToId === (comment._id || comment.id) ? null : (comment._id || comment.id));
                                            setReplyText("");
                                        }}
                                        className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                                    >
                                        <MessageSquareReply size={14} />
                                        {replyingToId === (comment._id || comment.id) ? "Cancel Reply" : "Reply"}
                                    </button>
                                </div>
                            )}

                            {/* Inline Reply Input Box */}
                            {replyingToId === (comment._id || comment.id) && (
                                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                                    <textarea
                                        rows="2"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={isAdminOrMod ? "Write an administrative response..." : "Write a reply..."}
                                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs resize-none"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setReplyingToId(null)}
                                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleAddReply(comment._id || comment.id)}
                                            disabled={isSubmittingReply}
                                            className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {isSubmittingReply ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                            Send Reply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
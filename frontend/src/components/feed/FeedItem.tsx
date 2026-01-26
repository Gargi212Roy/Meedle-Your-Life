import { useState } from "react";
import { FeedItemProps } from "../../types/feed";
import { toggleLikeMeedle } from "../../api/feed";
import ReplyComposer from "../replies/ReplyComposer";
import { Reply } from "../../types/reply";
import { Link } from "react-router-dom";
import { getRelativeTime } from "../../utils/time";

const FeedItem: React.FC<FeedItemProps> = ({ meedle }) => {
	const [liked, setLiked] = useState(meedle.likedByMe);
	const [likes, setLikes] = useState(meedle.likesCount);
	const [loading, setLoading] = useState(false);
	const [replies, setReplies] = useState<Reply[]>(meedle.replies || []);
	const [showReplies, setShowReplies] = useState(false);

	const handleLike = async () => {
		if (loading) return;
		setLoading(true);

		setLiked((prev) => !prev);
		setLikes((prev) => (liked ? prev - 1 : prev + 1));

		try {
			const res = await toggleLikeMeedle(meedle._id);
			setLiked(res.likedByMe);
			setLikes(res.likesCount);
		} catch {
			// rollback
			setLiked(meedle.likedByMe);
			setLikes(meedle.likesCount);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="feed-item">
			<div className="feed-header">
				<span>
					<Link
						to={`/profile/${meedle.author.username}`}
						className="feed-author"
					>
						@{meedle.author.username}
					</Link>
				</span>
				<span className="feed-date">
					{new Date(meedle.createdAt).toLocaleDateString()}
				</span>
			</div>
			<p>{meedle.text}</p>

			<button
				className={`like-btn ${liked ? "liked" : ""}`}
				onClick={handleLike}
				disabled={loading}
			>
				❤️ {likes}
			</button>

			<button
				className="reply-toggle"
				onClick={() => setShowReplies((p) => !p)}
			>
				💬 {replies.length}
			</button>

			{showReplies && (
				<div className="replies">
					{replies.map((reply) => (
						<div key={reply._id} className="reply-item">
							<div className="reply-header">
								<span className="reply-author">
									@{reply.author.username}
								</span>
								<span className="reply-time">
									{getRelativeTime(reply.createdAt)}
								</span>
							</div>

							<p className="reply-text">{reply.text}</p>
						</div>
					))}

					<ReplyComposer
						meedleId={meedle._id}
						onReplyAdded={(reply) =>
							setReplies((prev) => [...prev, reply])
						}
					/>
				</div>
			)}
		</div>
	);
};

export default FeedItem;

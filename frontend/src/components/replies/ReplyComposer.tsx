import { useState } from "react";
import { addReply } from "../../api/replies";
import { Reply } from "../../types/reply";
import "../../stylesheets/reply.scss";

interface ReplyComposerProps {
	meedleId: string;
	onReplyAdded: (reply: Reply) => void;
}

const ReplyComposer: React.FC<ReplyComposerProps> = ({
	meedleId,
	onReplyAdded,
}) => {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!text.trim() || loading) return;

		setLoading(true);

		try {
			const reply = await addReply(meedleId, text);
			onReplyAdded(reply);
			setText("");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="reply-composer">
			<input
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Write a reply…"
				maxLength={120}
			/>
			<button onClick={handleSubmit} disabled={loading}>
				Reply
			</button>
		</div>
	);
};

export default ReplyComposer;

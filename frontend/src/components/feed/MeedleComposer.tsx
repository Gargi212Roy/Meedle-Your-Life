import { useState } from "react";
import { createMeedle } from "../../api/feed";
import "../../stylesheets/feed.scss";
import { MeedleComposerProps } from "../../types/feed";

const MAX_CHARS = 280;

const MeedleComposer: React.FC<MeedleComposerProps> = ({ onCreated }) => {
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const remaining = MAX_CHARS - content.length;

	const handleSubmit = async () => {
		if (!content.trim()) return;

		setLoading(true);
		setError(null);

		try {
			await createMeedle({ text: content });
			setContent("");
			onCreated();
		} catch {
			setError("Failed to post meedle");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="meedle-composer">
			<textarea
				placeholder="What’s on your mind?"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				maxLength={MAX_CHARS}
			/>

			{error && <div className="composer-error">{error}</div>}

			<div className="composer-footer">
				<span className={`char-count ${remaining < 20 ? "warn" : ""}`}>
					{remaining}
				</span>

				<button
					disabled={loading || !content.trim()}
					onClick={handleSubmit}
				>
					{loading ? "Posting..." : "Meedle"}
				</button>
			</div>
		</div>
	);
};

export default MeedleComposer;

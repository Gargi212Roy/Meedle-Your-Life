import { useEffect, useRef, useState } from "react";
import Navbar from "../commons/Navbar";
import FeedItem from "./FeedItem";
import MeedleComposer from "./MeedleComposer";
import { fetchFeed } from "../../api/feed";
import { Meedle } from "../../types/feed";

const LIMIT = 10;

const FeedPage: React.FC = () => {
	const [feed, setFeed] = useState<Meedle[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const observerRef = useRef<HTMLDivElement | null>(null);
	const hasLoadedOnce = useRef(false);

	const loadFeed = async (pageToLoad: number) => {
		try {
			const data = await fetchFeed(pageToLoad, LIMIT);

			if (!data || !Array.isArray(data.meedles)) {
				setHasMore(false);
				return;
			}

			setFeed((prev) => [...prev, ...data.meedles]);

			if (data.meedles.length < LIMIT) {
				setHasMore(false);
			}
		} catch {
			setError("Failed to load feed");
			setHasMore(false);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		if (hasLoadedOnce.current) return;
		hasLoadedOnce.current = true;

		loadFeed(1);
	}, []);

	useEffect(() => {
		if (!observerRef.current || !hasMore || loadingMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setLoadingMore(true);
					setPage((prev) => prev + 1);
				}
			},
			{ threshold: 1 },
		);

		observer.observe(observerRef.current);

		return () => observer.disconnect();
	}, [hasMore, loadingMore]);

	useEffect(() => {
		if (page === 1) return;
		loadFeed(page);
	}, [page]);

	return (
		<>
			<Navbar />

			<main className="feed-container">
				<MeedleComposer
					onCreated={() => {
						setFeed([]);
						setPage(1);
						setHasMore(true);
						setLoading(true);
						setError(null);
						loadFeed(1);
					}}
				/>

				{loading && <p>Loading feed...</p>}
				{error && <p className="feed-error">{error}</p>}

				{!loading && !error && (
					<>
						{feed.map((meedle) => (
							<FeedItem key={meedle._id} meedle={meedle} />
						))}

						{hasMore && (
							<div ref={observerRef} className="feed-loader">
								{loadingMore && <p>Loading more…</p>}
							</div>
						)}

						{!hasMore && feed.length > 0 && (
							<p className="feed-end">You’re all caught up ✨</p>
						)}
					</>
				)}
			</main>
		</>
	);
};

export default FeedPage;

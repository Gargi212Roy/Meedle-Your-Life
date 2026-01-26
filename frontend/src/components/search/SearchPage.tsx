import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../commons/Navbar";
import { searchUsers } from "../../api/search";
import { SearchUser } from "../../types/search";
import "../../stylesheets/search.scss";

const SearchPage: React.FC = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchUser[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (query.trim().length < 2) {
			setResults([]);
			return;
		}

		const timer = setTimeout(async () => {
			setLoading(true);
			const data = await searchUsers(query);
			setResults(data);
			setLoading(false);
		}, 300);

		return () => clearTimeout(timer);
	}, [query]);

	return (
		<>
			<Navbar />

			<main className="feed-container">
				<input
					className="search-input"
					placeholder="Search users..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>

				{loading && <p className="search-hint">Searching…</p>}

				{!loading && results.length === 0 && query.length >= 2 && (
					<p className="search-hint">No users found</p>
				)}

				<div className="search-results">
					{results.map((user) => (
						<Link
							key={user.id}
							to={`/profile/${user.username}`}
							className="search-item"
						>
							<div className="search-username">
								@{user.username}
							</div>
							{user.bio && (
								<div className="search-bio">{user.bio}</div>
							)}
						</Link>
					))}
				</div>
			</main>
		</>
	);
};

export default SearchPage;

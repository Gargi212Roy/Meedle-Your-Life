import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../commons/Navbar";
import FeedItem from "../feed/FeedItem";
import { useAuth } from "../../context/AuthContext";
import {
	fetchUserLikes,
	fetchUserProfile,
	fetchUserReplies,
	followUser,
	unfollowUser,
} from "../../api/profile";
import { fetchUserMeedles } from "../../api/profile";
import { ProfileTab, UserProfile } from "../../types/profile";
import { Meedle } from "../../types/feed";
import api from "../../utils/axios";
import "../../stylesheets/profile.scss";

const MAX_BIO_LENGTH = 160;

const ProfilePage: React.FC = () => {
	const { username } = useParams<{ username: string }>();
	const { user } = useAuth();

	const [activeTab, setActiveTab] = useState<ProfileTab>("meedles");

	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [meedles, setMeedles] = useState<Meedle[]>([]);
	const [likedMeedles, setLikedMeedles] = useState<Meedle[]>([]);
	const [replies, setReplies] = useState<
		{ _id: string; text: string; meedleText: string }[]
	>([]);

	const [loading, setLoading] = useState(true);

	const [editingBio, setEditingBio] = useState(false);
	const [bioDraft, setBioDraft] = useState("");
	const [savingBio, setSavingBio] = useState(false);

	const [toast, setToast] = useState<string | null>(null);

	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const isOwnProfile = user?.username === username;
	const remainingChars = MAX_BIO_LENGTH - bioDraft.length;

	/* -------------------- INITIAL LOAD -------------------- */

	useEffect(() => {
		if (!username) return;

		const loadProfile = async () => {
			setLoading(true);

			const data = await fetchUserProfile(username);
			setProfile(data);
			setBioDraft(data.bio || "");

			const meedleRes = await fetchUserMeedles(username, 1);
			setMeedles(meedleRes.meedles);

			// reset tab-related state on profile change
			setActiveTab("meedles");
			setLikedMeedles([]);
			setReplies([]);

			setLoading(false);
		};

		loadProfile();
	}, [username]);

	/* -------------------- TAB DATA (LAZY LOAD) -------------------- */

	useEffect(() => {
		if (!username) return;

		if (activeTab === "likes" && likedMeedles.length === 0) {
			fetchUserLikes(username).then(setLikedMeedles);
		}

		if (activeTab === "replies" && replies.length === 0) {
			fetchUserReplies(username).then(setReplies);
		}
	}, [activeTab, username, likedMeedles.length, replies.length]);

	/* -------------------- AUTOSIZE TEXTAREA -------------------- */

	useEffect(() => {
		if (!textareaRef.current) return;

		textareaRef.current.style.height = "auto";
		textareaRef.current.style.height =
			textareaRef.current.scrollHeight + "px";
	}, [bioDraft, editingBio]);

	/* -------------------- TOAST AUTO-HIDE -------------------- */

	useEffect(() => {
		if (!toast) return;

		const timer = setTimeout(() => setToast(null), 2500);
		return () => clearTimeout(timer);
	}, [toast]);

	/* -------------------- HANDLERS -------------------- */

	const handleFollowToggle = async () => {
		if (!profile) return;

		try {
			if (profile.isFollowing) {
				await unfollowUser(profile._id);
			} else {
				await followUser(profile._id);
			}

			setProfile((prev) =>
				prev
					? {
							...prev,
							isFollowing: !prev.isFollowing,
							followersCount: prev.isFollowing
								? prev.followersCount - 1
								: prev.followersCount + 1,
						}
					: prev,
			);
		} catch {
			setToast("Something went wrong");
		}
	};

	const saveBio = async () => {
		if (!profile) return;

		setSavingBio(true);

		// optimistic update
		setProfile((prev) => (prev ? { ...prev, bio: bioDraft } : prev));

		try {
			await api.patch("/users/me", { bio: bioDraft });
			setToast("Profile updated");
			setEditingBio(false);
		} catch {
			// rollback
			setProfile((prev) => (prev ? { ...prev, bio: profile.bio } : prev));
			setToast("Failed to update bio");
		} finally {
			setSavingBio(false);
		}
	};

	if (loading || !profile) return null;

	return (
		<>
			<Navbar />

			<main className="feed-container">
				<div className={`profile-header ${savingBio ? "saving" : ""}`}>
					<h2 className="profile-username">@{profile.username}</h2>

					{!editingBio && profile.bio && (
						<p className="profile-bio">{profile.bio}</p>
					)}

					{editingBio && (
						<div className="edit-bio">
							<textarea
								ref={textareaRef}
								value={bioDraft}
								maxLength={MAX_BIO_LENGTH}
								onChange={(e) => setBioDraft(e.target.value)}
								placeholder="Tell people a little about yourself…"
							/>

							<div className="bio-footer">
								<span
									className={`char-counter ${
										remainingChars < 20 ? "warn" : ""
									}`}
								>
									{remainingChars}
								</span>

								<div className="profile-actions">
									<button
										className="profile-btn primary"
										onClick={saveBio}
										disabled={savingBio}
									>
										{savingBio ? "Saving…" : "Save"}
									</button>
									<button
										className="profile-btn"
										onClick={() => {
											setBioDraft(profile.bio || "");
											setEditingBio(false);
										}}
										disabled={savingBio}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}

					<div className="profile-meta">
						<span>{profile.followersCount} followers</span>
						<span>{profile.followingCount} following</span>
					</div>

					<div className="profile-actions">
						{isOwnProfile ? (
							<button
								className="profile-btn"
								onClick={() => setEditingBio(true)}
							>
								Edit Profile
							</button>
						) : (
							<button
								className="profile-btn primary"
								onClick={handleFollowToggle}
							>
								{profile.isFollowing ? "Unfollow" : "Follow"}
							</button>
						)}
					</div>

					<div className="profile-tabs">
						<div
							className={`profile-tab ${
								activeTab === "meedles" ? "active" : ""
							}`}
							onClick={() => setActiveTab("meedles")}
						>
							Meedles
						</div>

						<div
							className={`profile-tab ${
								activeTab === "replies" ? "active" : ""
							}`}
							onClick={() => setActiveTab("replies")}
						>
							Replies
						</div>

						<div
							className={`profile-tab ${
								activeTab === "likes" ? "active" : ""
							}`}
							onClick={() => setActiveTab("likes")}
						>
							Likes
						</div>
					</div>
				</div>

				{activeTab === "meedles" &&
					meedles.map((m) => <FeedItem key={m._id} meedle={m} />)}

				{activeTab === "likes" &&
					likedMeedles.map((m) => (
						<FeedItem key={m._id} meedle={m} />
					))}

				{activeTab === "replies" &&
					replies.map((r) => (
						<div key={r._id} className="reply-item">
							<p className="reply-text">{r.text}</p>
							<span className="reply-context">
								Replying to: “{r.meedleText}”
							</span>
						</div>
					))}
			</main>

			{toast && <div className="toast">{toast}</div>}
		</>
	);
};

export default ProfilePage;

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import groupService from "../services/groupService";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const [groupName, setGroupName] = useState("");
    const [tripId, setTripId] = useState("");

    const [inviteEmail, setInviteEmail] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /*
     * ---------------------------------------------------------
     * GET CURRENT USER EMAIL
     * ---------------------------------------------------------
     *
     * Your TripNest app stores the logged-in email in localStorage.
     * We check both "email" and "user" so the page works with
     * either storage format.
     */
    const getCurrentUserEmail = () => {
        const directEmail = localStorage.getItem("email");

        if (directEmail) {
            return directEmail.trim().toLowerCase();
        }

        try {
            const user = JSON.parse(
                localStorage.getItem("user") || "null"
            );

            if (user?.email) {
                return user.email.trim().toLowerCase();
            }
        } catch (err) {
            console.warn(
                "Could not read user from localStorage:",
                err
            );
        }

        return "";
    };

    /*
     * ---------------------------------------------------------
     * FIND CURRENT USER'S MEMBERSHIP
     * ---------------------------------------------------------
     *
     * Depending on the backend response, email may be returned as:
     *
     * member.email
     * member.userEmail
     * member.user.email
     *
     * We support all three.
     */
    const getCurrentMembership = (group) => {
        if (!group?.members || !Array.isArray(group.members)) {
            return null;
        }

        const currentEmail = getCurrentUserEmail();

        if (!currentEmail) {
            return null;
        }

        return (
            group.members.find((member) => {
                const memberEmail =
                    member?.email ||
                    member?.userEmail ||
                    member?.user?.email ||
                    "";

                return (
                    memberEmail.toString().trim().toLowerCase() ===
                    currentEmail
                );
            }) || null
        );
    };

    /*
     * ---------------------------------------------------------
     * CHECK WHETHER CURRENT USER HAS PENDING INVITATION
     * ---------------------------------------------------------
     */
    const isPending = (group) => {
        const membership = getCurrentMembership(group);

        // Most reliable check:
        // current user's membership is PENDING
        if (
            membership?.status?.toString().toUpperCase() ===
            "PENDING"
        ) {
            return true;
        }

        // Fallbacks for different backend response structures
        if (
            group?.status?.toString().toUpperCase() ===
            "PENDING"
        ) {
            return true;
        }

        if (
            group?.invitationStatus
                ?.toString()
                .toUpperCase() === "PENDING"
        ) {
            return true;
        }

        return false;
    };

    /*
     * ---------------------------------------------------------
     * LOAD GROUPS
     * ---------------------------------------------------------
     */
    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await groupService.getAll();

            console.log(
                "TripNest groups response:",
                response.data
            );

            setGroups(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            console.error(
                "Groups load failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load groups."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * ---------------------------------------------------------
     * CREATE GROUP
     * ---------------------------------------------------------
     */
    const createGroup = async (e) => {
        e.preventDefault();

        if (!groupName.trim()) {
            setError("Enter a group name.");
            return;
        }

        try {
            setError("");
            setSuccess("");

            await groupService.create({
                name: groupName.trim(),
                tripId: tripId
                    ? Number(tripId)
                    : null,
            });

            setGroupName("");
            setTripId("");

            await loadGroups();

            setSuccess(
                "Group created successfully!"
            );
        } catch (err) {
            console.error(
                "Group creation failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create group."
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * INVITE MEMBER
     * ---------------------------------------------------------
     */
    const inviteMember = async (group) => {
        if (!inviteEmail.trim()) {
            setError(
                "Enter your friend's email."
            );
            return;
        }

        try {
            setError("");
            setSuccess("");

            await groupService.invite(
                group.id,
                inviteEmail.trim()
            );

            setInviteEmail("");
            setSelectedGroup(null);

            await loadGroups();

            setSuccess(
                "Invitation sent successfully!"
            );
        } catch (err) {
            console.error(
                "Invite failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to send invitation."
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * DELETE GROUP
     * ---------------------------------------------------------
     */
    const deleteGroup = async (id) => {
        if (
            !window.confirm(
                "Delete this group?"
            )
        ) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await groupService.delete(id);

            setGroups((previousGroups) =>
                previousGroups.filter(
                    (group) => group.id !== id
                )
            );

            if (
                selectedGroup?.id === id
            ) {
                setSelectedGroup(null);
            }

            setSuccess(
                "Group deleted successfully."
            );
        } catch (err) {
            console.error(
                "Group delete failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete group."
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * ACCEPT INVITATION
     * ---------------------------------------------------------
     */
    const acceptInvite = async (groupId) => {
        try {
            setError("");
            setSuccess("");

            console.log(
                "Accepting group invitation:",
                groupId
            );

            await groupService.accept(
                groupId
            );

            /*
             * Reload groups so PENDING becomes
             * ACCEPTED immediately on the page.
             */
            await loadGroups();

            setSuccess(
                "Invitation accepted successfully!"
            );
        } catch (err) {
            console.error(
                "Accept invitation failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to accept invitation."
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * DECLINE INVITATION
     * ---------------------------------------------------------
     */
    const declineInvite = async (groupId) => {
        try {
            setError("");
            setSuccess("");

            await groupService.decline(
                groupId
            );

            await loadGroups();

            setSuccess(
                "Invitation declined."
            );
        } catch (err) {
            console.error(
                "Decline invitation failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to decline invitation."
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * REMOVE MEMBER
     * ---------------------------------------------------------
     */
    const removeMember = async (
        groupId,
        memberId
    ) => {
        if (
            !window.confirm(
                "Remove this member from the group?"
            )
        ) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await groupService.removeMember(
                groupId,
                memberId
            );

            await loadGroups();

            setSuccess(
                "Member removed successfully."
            );
        } catch (err) {
            console.error(
                "Remove member failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to remove member."
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * LOADING SCREEN
     * ---------------------------------------------------------
     */
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
                    <div className="bg-white rounded-3xl p-12 mt-5 text-center border border-slate-200">
                        <div className="text-4xl animate-pulse">
                            👥
                        </div>

                        <p className="text-slate-500 mt-4">
                            Loading groups...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">

                {/* =================================================
                    HEADER
                ================================================= */}
                <section className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-7 sm:p-10 text-white shadow-lg">
                    <div className="max-w-3xl">

                        <p className="text-violet-100 text-sm font-semibold uppercase tracking-wide">
                            👥 Group Travel
                        </p>

                        <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                            Travel Groups
                        </h1>

                        <p className="text-violet-100 mt-3 text-sm sm:text-base">
                            Create groups, invite your
                            travel companions, and
                            manage your group members.
                        </p>

                    </div>
                </section>

                {/* =================================================
                    ERROR
                ================================================= */}
                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 flex items-start gap-3">
                        <span>⚠️</span>

                        <p>{error}</p>
                    </div>
                )}

                {/* =================================================
                    SUCCESS
                ================================================= */}
                {success && (
                    <div className="mt-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4 flex items-start gap-3">
                        <span>✓</span>

                        <p>{success}</p>
                    </div>
                )}

                {/* =================================================
                    CREATE GROUP
                ================================================= */}
                <section className="bg-white border border-slate-200 rounded-3xl p-6 mt-8 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center text-xl">
                            👥
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                Create a Group
                            </h2>

                            <p className="text-sm text-slate-500">
                                Start planning your trip
                                with friends.
                            </p>
                        </div>

                    </div>

                    <form
                        onSubmit={createGroup}
                        className="grid md:grid-cols-3 gap-4 mt-6"
                    >

                        <input
                            value={groupName}
                            onChange={(e) =>
                                setGroupName(
                                    e.target.value
                                )
                            }
                            placeholder="Group name"
                            className="px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
                        />

                        <input
                            value={tripId}
                            onChange={(e) =>
                                setTripId(
                                    e.target.value
                                )
                            }
                            type="number"
                            placeholder="Trip ID (optional)"
                            className="px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
                        />

                        <button
                            type="submit"
                            className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold px-5 py-3 transition"
                        >
                            + Create Group
                        </button>

                    </form>
                </section>

                {/* =================================================
                    GROUP LIST
                ================================================= */}
                <section className="mt-10">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                Invite members
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Manage your travel companions.
                            </p>
                        </div>

                        <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {groups.length} group
                            {groups.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>

                    {groups.length === 0 ? (

                        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center mt-5">

                            <div className="text-6xl">
                                🌍
                            </div>

                            <h3 className="font-bold text-xl mt-5 text-slate-800">
                                No groups yet
                            </h3>

                            <p className="text-sm text-slate-500 mt-2">
                                Create your first group
                                and invite your travel
                                companions.
                            </p>

                        </div>

                    ) : (

                        <div className="grid lg:grid-cols-2 gap-6 mt-5">

                            {groups.map((group) => {

                                const pending =
                                    isPending(group);

                                const currentMembership =
                                    getCurrentMembership(
                                        group
                                    );

                                return (
                                    <div
                                        key={group.id}
                                        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition"
                                    >

                                        {/* =================================================
                                            GROUP HEADER
                                        ================================================= */}
                                        <div className="flex justify-between gap-4">

                                            <div>

                                                <div className="flex items-center gap-3">

                                                    <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center text-xl">
                                                        👥
                                                    </div>

                                                    <div>

                                                        <h3 className="text-lg font-bold text-slate-800">
                                                            {group.name ||
                                                                "Travel Group"}
                                                        </h3>

                                                        <p className="text-sm text-slate-500">
                                                            Group #
                                                            {group.id}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* Do not show Delete for a
                                                pending invitation */}
                                            {!pending && (
                                                <button
                                                    onClick={() =>
                                                        deleteGroup(
                                                            group.id
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            )}

                                        </div>

                                        {/* =================================================
                                            PENDING INVITATION
                                        ================================================= */}
                                        {pending && (
                                            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-5">

                                                <div className="flex items-start gap-3">

                                                    <div className="text-2xl">
                                                        📩
                                                    </div>

                                                    <div>

                                                        <p className="font-semibold text-amber-800">
                                                            Group Invitation
                                                        </p>

                                                        <p className="text-sm text-amber-700 mt-1">
                                                            You have been
                                                            invited to join
                                                            <strong>
                                                                {" "}
                                                                {group.name}
                                                            </strong>.
                                                        </p>

                                                        {currentMembership?.invitedBy && (
                                                            <p className="text-xs text-amber-600 mt-1">
                                                                Invited by{" "}
                                                                {
                                                                    currentMembership.invitedBy
                                                                }
                                                            </p>
                                                        )}

                                                    </div>

                                                </div>

                                                <div className="flex gap-3 mt-4">

                                                    <button
                                                        onClick={() =>
                                                            acceptInvite(
                                                                group.id
                                                            )
                                                        }
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                                                    >
                                                        ✓ Accept
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            declineInvite(
                                                                group.id
                                                            )
                                                        }
                                                        className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                                                    >
                                                        ✕ Decline
                                                    </button>

                                                </div>

                                            </div>
                                        )}

                                        {/* =================================================
                                            INVITE MEMBER
                                        ================================================= */}
                                        {!pending && (
                                            <div className="mt-6">

                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                                                    Invite a member
                                                </p>

                                                <div className="flex gap-2">

                                                    <input
                                                        value={
                                                            selectedGroup?.id ===
                                                                group.id
                                                                ? inviteEmail
                                                                : ""
                                                        }
                                                        onChange={(e) => {
                                                            setSelectedGroup(
                                                                group
                                                            );

                                                            setInviteEmail(
                                                                e.target.value
                                                            );
                                                        }}
                                                        placeholder="Friend's email"
                                                        type="email"
                                                        className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500"
                                                    />

                                                    <button
                                                        onClick={() =>
                                                            inviteMember(
                                                                group
                                                            )
                                                        }
                                                        className="bg-violet-600 hover:bg-violet-700 text-white px-4 rounded-xl text-sm font-semibold"
                                                    >
                                                        Invite
                                                    </button>

                                                </div>

                                            </div>
                                        )}

                                        {/* =================================================
                                            MEMBERS
                                        ================================================= */}
                                        {group.members &&
                                            group.members.length > 0 && (
                                                <div className="mt-6">

                                                    <div className="flex justify-between items-center">

                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                                            Members
                                                        </p>

                                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                            {
                                                                group
                                                                    .members
                                                                    .length
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="mt-3 space-y-2">

                                                        {group.members.map(
                                                            (member) => {

                                                                const memberEmail =
                                                                    member?.email ||
                                                                    member?.userEmail ||
                                                                    member?.user?.email ||
                                                                    "";

                                                                const memberName =
                                                                    member?.name ||
                                                                    member?.user?.name ||
                                                                    memberEmail ||
                                                                    "Member";

                                                                const status =
                                                                    member?.status
                                                                        ?.toString()
                                                                        .toUpperCase() ||
                                                                    "";

                                                                return (
                                                                    <div
                                                                        key={
                                                                            member.id ||
                                                                            memberEmail
                                                                        }
                                                                        className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-3"
                                                                    >

                                                                        <div className="flex items-center gap-3">

                                                                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                                👤
                                                                            </div>

                                                                            <div>

                                                                                <p className="text-sm font-medium text-slate-700">
                                                                                    {
                                                                                        memberName
                                                                                    }
                                                                                </p>

                                                                                {memberEmail && (
                                                                                    <p className="text-xs text-slate-400">
                                                                                        {
                                                                                            memberEmail
                                                                                        }
                                                                                    </p>
                                                                                )}

                                                                            </div>

                                                                        </div>

                                                                        <div className="flex items-center gap-2">

                                                                            {status ===
                                                                                "PENDING" && (
                                                                                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                                                                        Pending
                                                                                    </span>
                                                                                )}

                                                                            {status ===
                                                                                "ACCEPTED" && (
                                                                                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                                                                        Accepted
                                                                                    </span>
                                                                                )}

                                                                            {member.id && (
                                                                                <button
                                                                                    onClick={() =>
                                                                                        removeMember(
                                                                                            group.id,
                                                                                            member.id
                                                                                        )
                                                                                    }
                                                                                    className="text-xs text-red-500 hover:text-red-700"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            )}

                                                                        </div>

                                                                    </div>
                                                                );
                                                            }
                                                        )}

                                                    </div>

                                                </div>
                                            )}

                                        {/* =================================================
                                            NO MEMBERS
                                        ================================================= */}
                                        {!group.members?.length && (
                                            <div className="mt-6 bg-slate-50 rounded-2xl p-4 text-center">

                                                <p className="text-sm text-slate-500">
                                                    No members yet.
                                                    Invite your
                                                    friends to this
                                                    group.
                                                </p>

                                            </div>
                                        )}

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </section>
            </main>
        </div>
    );
};

export default Groups;
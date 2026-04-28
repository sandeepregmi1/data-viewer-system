import React, { useEffect, useState } from "react";
import { getRegistrations } from "../services/api";
import { Registration } from "../types/registration";


const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const formatShort = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const expColor: Record<string, { bg: string; color: string }> = {
    Advanced: { bg: "#d1fae5", color: "#065f46" },
    Intermediate: { bg: "#dbeafe", color: "#1e40af" },
    Beginner: { bg: "#f3f4f6", color: "#374151" },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

const Badge: React.FC<{
    label: string;
    variant?: "role" | "track" | "exp";
}> = ({ label, variant = "role" }) => {
    if (variant === "exp") {
        const style = expColor[label] ?? expColor["Beginner"];
        return (
            <span
                style={{
                    display: "inline-block",
                    padding: "2px 9px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    background: style.bg,
                    color: style.color,
                    letterSpacing: "0.02em",
                }}
            >
                {label}
            </span>
        );
    }
    const styles: Record<string, React.CSSProperties> = {
        role: { background: "#e0f2fe", color: "#0c4a6e" },
        track: { background: "#dcfce7", color: "#14532d" },
    };
    return (
        <span
            style={{
                display: "inline-block",
                padding: "2px 9px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.02em",
                ...styles[variant],
            }}
        >
            {label}
        </span>
    );
};

// ─── Detail Modal ────────────────────────────────────────────────────────────

const DetailView: React.FC<{
    item: Registration;
    onClose: () => void;
}> = ({ item, onClose }) => {
    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div style={{ marginBottom: 20 }}>
            <div
                style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#6b7280",
                    marginBottom: 10,
                    paddingBottom: 6,
                    borderBottom: "1px solid #f3f4f6",
                }}
            >
                {title}
            </div>
            {children}
        </div>
    );

    const Field: React.FC<{ label: string; value: React.ReactNode; mono?: boolean; full?: boolean }> = ({
        label, value, mono, full,
    }) => (
        <div style={{ gridColumn: full ? "1 / -1" : undefined, marginBottom: 4 }}>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{label}</div>
            <div
                style={{
                    fontSize: 13,
                    color: mono ? "#6b7280" : "#111827",
                    fontFamily: mono ? "monospace" : undefined,
                    wordBreak: "break-all",
                }}
            >
                {value || "—"}
            </div>
        </div>
    );

    return (
        <div
            id="detail-view"
            style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e8eef4",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                width: "100%",
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                animation: "fadeIn 0.3s ease-out",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "20px 24px 16px",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Avatar */}
                    <div
                        style={{
                            width: 46,
                            height: 46,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 16,
                            flexShrink: 0,
                        }}
                    >
                        {item.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
                            {item.full_name}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                            {item.email}
                        </div>
                        <div style={{ marginTop: 5, display: "flex", gap: 6 }}>
                            <Badge label={item.role} variant="role" />
                            <Badge label={item.track} variant="track" />
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: "#f3f4f6",
                        border: "none",
                        borderRadius: 8,
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontSize: 14,
                        color: "#6b7280",
                        lineHeight: 1,
                    }}
                >
                    ✕ Close
                </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 32,
                    }}
                >
                    <div>
                        <Section title="Personal & Contact">
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "10px 24px",
                                }}
                            >
                                <Field label="Age" value={item.age} />
                                <Field label="Phone" value={item.phone_number} />
                                <Field label="GitHub" value={item.github_portfolio} full />
                                <Field label="LinkedIn" value={item.linkedin} full />
                            </div>
                        </Section>

                        <Section title="Academic & Role">
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "10px 24px",
                                }}
                            >
                                <Field label="Institution" value={item.institution} full />
                                <Field label="Track" value={<Badge label={item.track} variant="track" />} />
                                <Field label="Role" value={<Badge label={item.role} variant="role" />} />
                                <Field label="Experience" value={<Badge label={item.experience} variant="exp" />} />
                            </div>
                        </Section>
                    </div>

                    <div>
                        <Section title="Team Information">
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "10px 24px",
                                    marginBottom: 12,
                                }}
                            >
                                <Field
                                    label="Team Name"
                                    value={item.team_name || "Solo participation"}
                                />
                                <Field label="Team Size" value={item.team_size} />
                            </div>
                            {item.team_members && item.team_members.length > 0 ? (
                                <div>
                                    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>
                                        Other members
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                        {item.team_members.map((m, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    padding: "7px 12px",
                                                    background: "#f9fafb",
                                                    borderRadius: 8,
                                                    fontSize: 13,
                                                }}
                                            >
                                                <span style={{ fontWeight: 500, color: "#111827" }}>
                                                    {m.name}
                                                </span>
                                                <span style={{ color: "#3b82f6", fontSize: 12 }}>
                                                    {m.github || "No GitHub"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                                    No other members listed.
                                </div>
                            )}
                        </Section>

                        <Section title="System Metadata">
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "10px 24px",
                                }}
                            >
                                <Field label="Created" value={formatDate(item.createdAt)} />
                                <Field label="Updated" value={formatDate(item.updatedAt)} />
                                <Field label="Database ID" value={item._id} mono full />
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Pagination ──────────────────────────────────────────────────────────────

const Pagination: React.FC<{
    current: number;
    total: number;
    onChange: (n: number) => void;
}> = ({ current, total, onChange }) => {
    if (total <= 1) return null;

    const nums = Array.from({ length: total }, (_, i) => i + 1).filter(
        (n) => total <= 7 || Math.abs(n - current) <= 2 || n === 1 || n === total
    );

    const btnStyle = (active: boolean, disabled?: boolean): React.CSSProperties => ({
        padding: "6px 12px",
        borderRadius: 7,
        border: "1px solid",
        borderColor: active ? "#3b82f6" : "#e5e7eb",
        background: active ? "#3b82f6" : "#fff",
        color: active ? "#fff" : disabled ? "#d1d5db" : "#374151",
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
    });

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 4,
                padding: "14px 16px",
                borderTop: "1px solid #f3f4f6",
            }}
        >
            <button
                style={btnStyle(false, current === 1)}
                onClick={() => current > 1 && onChange(current - 1)}
                disabled={current === 1}
            >
                ← Prev
            </button>

            {nums.map((n, i) => (
                <React.Fragment key={n}>
                    {i > 0 && nums[i - 1] !== n - 1 && (
                        <span style={{ color: "#9ca3af", fontSize: 13, padding: "0 2px" }}>
                            …
                        </span>
                    )}
                    <button style={btnStyle(n === current)} onClick={() => onChange(n)}>
                        {n}
                    </button>
                </React.Fragment>
            ))}

            <button
                style={btnStyle(false, current === total)}
                onClick={() => current < total && onChange(current + 1)}
                disabled={current === total}
            >
                Next →
            </button>
        </div>
    );
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
    const [data, setData] = useState<Registration[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Registration | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getRegistrations();
            const sorted = [...res].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setData(sorted);
        } catch (error) {
            console.error("Failed to fetch registrations", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter
    const filteredData = data.filter((item) =>
        `${item.full_name} ${item.email} ${item.team_name ?? ""} ${item.institution}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // Reset page on search / rows change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, rowsPerPage]);

    // Pagination slicing
    const indexOfFirst = (currentPage - 1) * rowsPerPage;
    const indexOfLast = indexOfFirst + rowsPerPage;
    const currentRecords = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

    // CSV export
    const downloadCSV = () => {
        if (!filteredData.length) return;
        const headers = [
            "SN", "Full Name", "Email", "Age", "Phone", "Institution", "Track",
            "Role", "Experience", "Team Name", "Team Size", "GitHub", "LinkedIn",
            "Team Members", "Created At", "Updated At", "ID",
        ];
        const rows = filteredData.map((item, i) => {
            const members =
                item.team_members
                    ?.map((m) => `${m.name}(${m.github || "N/A"})`)
                    .join(" | ") || "N/A";
            return [
                i + 1,
                `"${item.full_name}"`,
                `"${item.email}"`,
                item.age,
                `"${item.phone_number || "—"}"`,
                `"${item.institution}"`,
                `"${item.track}"`,
                `"${item.role}"`,
                `"${item.experience}"`,
                `"${item.team_name || "Solo"}"`,
                item.team_size,
                `"${item.github_portfolio || "—"}"`,
                `"${item.linkedin || "—"}"`,
                `"${members}"`,
                `"${formatDate(item.createdAt)}"`,
                `"${formatDate(item.updatedAt)}"`,
                `"${item._id}"`,
            ];
        });
        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `registrations_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // ── Styles ────────────────────────────────────────────────────────────────

    const s: Record<string, React.CSSProperties> = {
        page: {
            minHeight: "100vh",
            background: "#f8fafc",
            fontFamily:
                '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        inner: {
            maxWidth: 1280,
            margin: "0 auto",
            padding: "28px 24px",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
        },
        title: {
            fontSize: 22,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "-0.02em",
        },
        subtitle: {
            fontSize: 13,
            color: "#64748b",
            marginTop: 4,
        },
        btnExport: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            borderRadius: 9,
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#374151",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        },
        controls: {
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap" as const,
        },
        searchWrap: {
            position: "relative" as const,
            flex: 1,
            minWidth: 200,
        },
        searchIcon: {
            position: "absolute" as const,
            left: 11,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
            fontSize: 15,
            pointerEvents: "none" as const,
        },
        searchInput: {
            width: "100%",
            padding: "9px 12px 9px 34px",
            borderRadius: 9,
            border: "1px solid #e2e8f0",
            background: "#fff",
            fontSize: 13,
            color: "#0f172a",
            outline: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        },
        rowsSelect: {
            padding: "9px 12px",
            borderRadius: 9,
            border: "1px solid #e2e8f0",
            background: "#fff",
            fontSize: 13,
            color: "#374151",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        },
        pagStat: {
            fontSize: 12,
            color: "#64748b",
            whiteSpace: "nowrap" as const,
        },
        card: {
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e8eef4",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        },
        tableWrap: {
            overflowX: "auto" as const,
        },
        table: {
            width: "100%",
            borderCollapse: "collapse" as const,
            fontSize: 13,
            minWidth: 900,
        },
        thead: {
            background: "#f8fafc",
            borderBottom: "1px solid #e8eef4",
        },
        th: {
            padding: "10px 14px",
            fontWeight: 600,
            fontSize: 11,
            textTransform: "uppercase" as const,
            letterSpacing: "0.06em",
            color: "#94a3b8",
            textAlign: "left" as const,
            whiteSpace: "nowrap" as const,
        },
        tdBase: {
            padding: "11px 14px",
            color: "#0f172a",
            verticalAlign: "middle" as const,
            borderBottom: "1px solid #f1f5f9",
            whiteSpace: "nowrap" as const,
        },
        emptyState: {
            textAlign: "center" as const,
            padding: "48px 24px",
            color: "#94a3b8",
            fontSize: 14,
        },
        loadingState: {
            textAlign: "center" as const,
            padding: "48px 24px",
            color: "#94a3b8",
            fontSize: 14,
        },
    };

    return (
        <div style={s.page}>
            <div style={s.inner}>
                {/* ── Header ── */}
                <div style={s.header}>
                    <div>
                        <div style={s.title}>Registration Records</div>
                        <div style={s.subtitle}>
                            {loading
                                ? "Loading…"
                                : `${filteredData.length} record${filteredData.length !== 1 ? "s" : ""} in the system`}
                        </div>
                    </div>
                    <button
                        style={s.btnExport}
                        onClick={downloadCSV}
                        disabled={filteredData.length === 0}
                    >
                        ↓ Export CSV
                    </button>
                </div>

                {/* ── Controls ── */}
                <div style={s.controls}>
                    <div style={s.searchWrap}>
                        <span style={s.searchIcon}>⌕</span>
                        <input
                            type="text"
                            placeholder="Search name, email, team, institution…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={s.searchInput}
                        />
                    </div>

                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        style={s.rowsSelect}
                    >
                        <option value={10}>10 / page</option>
                        <option value={25}>25 / page</option>
                        <option value={50}>50 / page</option>
                        <option value={100}>100 / page</option>
                    </select>

                    {filteredData.length > 0 && (
                        <div style={s.pagStat}>
                            Showing{" "}
                            <strong>{Math.min(indexOfFirst + 1, filteredData.length)}</strong>–
                            <strong>{Math.min(indexOfLast, filteredData.length)}</strong>{" "}
                            of <strong>{filteredData.length}</strong>
                        </div>
                    )}
                </div>

                {/* ── Table Card ── */}
                <div style={s.card}>
                    <div style={s.tableWrap}>
                        {loading ? (
                            <div style={s.loadingState}>Fetching records…</div>
                        ) : (
                            <table style={s.table}>
                                <thead style={s.thead}>
                                    <tr>
                                        <th style={{ ...s.th, width: 44 }}>#</th>
                                        <th style={s.th}>Name</th>
                                        <th style={s.th}>Email</th>
                                        <th style={s.th}>Role</th>
                                        <th style={s.th}>Track</th>
                                        <th style={s.th}>Team</th>
                                        <th style={{ ...s.th, textAlign: "center" }}>Size</th>
                                        <th style={s.th}>Institution</th>
                                        <th style={s.th}>Experience</th>
                                        <th style={s.th}>Registered</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((item, index) => {
                                        const isTeam = item.team_name?.trim();
                                        return (
                                            <tr
                                                key={item._id}
                                                onClick={() => {
                                                    setSelected(item);
                                                    setTimeout(() => {
                                                        document.getElementById("detail-view")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                                    }, 100);
                                                }}
                                                style={{ 
                                                    cursor: "pointer",
                                                    background: selected?._id === item._id ? "#eff6ff" : "transparent"
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (selected?._id !== item._id) {
                                                        e.currentTarget.style.background = "#f8fafc";
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (selected?._id !== item._id) {
                                                        e.currentTarget.style.background = "transparent";
                                                    }
                                                }}
                                            >
                                                {/* SN */}
                                                <td
                                                    style={{
                                                        ...s.tdBase,
                                                        color: "#94a3b8",
                                                        fontSize: 12,
                                                        width: 44,
                                                    }}
                                                >
                                                    {indexOfFirst + index + 1}
                                                </td>

                                                {/* Name */}
                                                <td style={{ ...s.tdBase, fontWeight: 600, minWidth: 140 }}>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 9,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 30,
                                                                height: 30,
                                                                borderRadius: "50%",
                                                                background:
                                                                    "linear-gradient(135deg, #3b82f6, #6366f1)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#fff",
                                                                fontWeight: 700,
                                                                fontSize: 11,
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {item.full_name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .slice(0, 2)
                                                                .join("")
                                                                .toUpperCase()}
                                                        </div>
                                                        {item.full_name}
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td
                                                    style={{
                                                        ...s.tdBase,
                                                        color: "#64748b",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {item.email}
                                                </td>

                                                {/* Role */}
                                                <td style={s.tdBase}>
                                                    <Badge label={item.role} variant="role" />
                                                </td>

                                                {/* Track */}
                                                <td style={s.tdBase}>
                                                    <Badge label={item.track} variant="track" />
                                                </td>

                                                {/* Team */}
                                                <td style={{ ...s.tdBase, fontWeight: 500 }}>
                                                    {isTeam ? (
                                                        item.team_name
                                                    ) : (
                                                        <span
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#94a3b8",
                                                                fontWeight: 400,
                                                            }}
                                                        >
                                                            Solo
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Size */}
                                                <td
                                                    style={{
                                                        ...s.tdBase,
                                                        textAlign: "center",
                                                        color: "#64748b",
                                                    }}
                                                >
                                                    {item.team_size}
                                                </td>

                                                {/* Institution */}
                                                <td
                                                    style={{
                                                        ...s.tdBase,
                                                        color: "#64748b",
                                                        fontSize: 12,
                                                        maxWidth: 180,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item.institution}
                                                </td>

                                                {/* Experience */}
                                                <td style={s.tdBase}>
                                                    <Badge label={item.experience} variant="exp" />
                                                </td>

                                                {/* Registered */}
                                                <td
                                                    style={{
                                                        ...s.tdBase,
                                                        fontSize: 12,
                                                        color: "#64748b",
                                                    }}
                                                >
                                                    {formatShort(item.createdAt)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {!loading && filteredData.length === 0 && (
                            <div style={s.emptyState}>No records match your search.</div>
                        )}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        current={currentPage}
                        total={totalPages}
                        onChange={setCurrentPage}
                    />
                </div>

                {/* ── Detail View ── */}
                {selected && (
                    <DetailView item={selected} onClose={() => setSelected(null)} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
import React, { useEffect, useState } from "react";
import { getRegistrations } from "../services/api";
import { Registration } from "../types/registration";
import { Link } from "react-router-dom";

interface FlatMemberRow {
    type: "team" | "member" | "spacer";
    teamName?: string;
    teamSN?: number;
    memberSN?: string;
    name?: string;
    email?: string;
    phone?: string;
    age?: number | string;
    role?: string;
    track?: string;
    institution?: string;
    github?: string;
    linkedin?: string;
    isLead?: boolean;
}

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, padding: "14px 16px", borderTop: "1px solid #f3f4f6" }}>
            <button style={btnStyle(false, current === 1)} onClick={() => current > 1 && onChange(current - 1)} disabled={current === 1}>← Prev</button>
            {nums.map((n, i) => (
                <React.Fragment key={n}>
                    {i > 0 && nums[i - 1] !== n - 1 && <span style={{ color: "#9ca3af", fontSize: 13, padding: "0 2px" }}>…</span>}
                    <button style={btnStyle(n === current)} onClick={() => onChange(n)}>{n}</button>
                </React.Fragment>
            ))}
            <button style={btnStyle(false, current === total)} onClick={() => current < total && onChange(current + 1)} disabled={current === total}>Next →</button>
        </div>
    );
};

const MembersList: React.FC = () => {
    const [data, setData] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [flatRows, setFlatRows] = useState<FlatMemberRow[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getRegistrations();
            const sorted = [...res].sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            setData(sorted);
        } catch (error) {
            console.error("Failed to fetch registrations", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter((item) =>
        `${item.full_name} ${item.email} ${item.team_name ?? ""} ${item.institution}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    useEffect(() => {
        const indexOfFirst = (currentPage - 1) * rowsPerPage;
        const indexOfLast = indexOfFirst + rowsPerPage;
        const currentTeams = filteredData.slice(indexOfFirst, indexOfLast);
        
        const rows: FlatMemberRow[] = [];
        currentTeams.forEach((reg, idx) => {
            const globalTeamIdx = indexOfFirst + idx;
            const teamSN = globalTeamIdx + 1;
            
            rows.push({ type: "team", teamName: reg.team_name || "Solo Participation", teamSN: teamSN });
            rows.push({
                type: "member",
                memberSN: `${teamSN}.1`,
                name: reg.full_name,
                email: reg.email,
                phone: reg.phone_number,
                age: reg.age,
                role: reg.role,
                track: reg.track,
                institution: reg.institution,
                github: reg.github_portfolio,
                linkedin: reg.linkedin,
                isLead: true,
            });

            if (reg.team_members && reg.team_members.length > 0) {
                reg.team_members.forEach((m, mIdx) => {
                    rows.push({
                        type: "member",
                        memberSN: `${teamSN}.${mIdx + 2}`,
                        name: m.name,
                        email: m.email,
                        phone: m.phoneNumber,
                        age: m.age,
                        role: "—",
                        track: reg.track,
                        institution: "—",
                        github: m.github,
                        linkedin: "—",
                        isLead: false,
                    });
                });
            }
            rows.push({ type: "spacer" });
        });
        setFlatRows(rows);
    }, [filteredData, currentPage, rowsPerPage]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

    const downloadCSV = () => {
        // Export ALL filtered data, not just current page
        const allRows: FlatMemberRow[] = [];
        filteredData.forEach((reg, teamIdx) => {
            const teamSN = teamIdx + 1;
            allRows.push({ type: "team", teamName: reg.team_name || "Solo Participation", teamSN: teamSN });
            allRows.push({
                type: "member",
                memberSN: `${teamSN}.1`,
                name: reg.full_name,
                email: reg.email,
                phone: reg.phone_number,
                age: reg.age,
                role: reg.role,
                track: reg.track,
                institution: reg.institution,
                github: reg.github_portfolio,
                linkedin: reg.linkedin,
                isLead: true,
            });
            if (reg.team_members && reg.team_members.length > 0) {
                reg.team_members.forEach((m, mIdx) => {
                    allRows.push({
                        type: "member",
                        memberSN: `${teamSN}.${mIdx + 2}`,
                        name: m.name,
                        email: m.email,
                        phone: m.phoneNumber,
                        age: m.age,
                        role: "—",
                        track: reg.track,
                        institution: "—",
                        github: m.github,
                        linkedin: "—",
                        isLead: false,
                    });
                });
            }
            allRows.push({ type: "spacer" });
        });

        const headers = ["SN", "Team Name", "Name", "Email", "Phone", "Age", "Role", "Track", "Institution", "GitHub", "LinkedIn", "Type"];
        const csvContent = [headers.join(","), ...allRows.map(row => {
            if (row.type === "team") return [row.teamSN, `"${row.teamName}"`, "", "", "", "", "", "", "", "", "", "TEAM HEADER"];
            if (row.type === "spacer") return ["", "", "", "", "", "", "", "", "", "", "", ""];
            return [
                row.memberSN, `"${row.teamName || "Solo"}"`, `"${row.name}"`, `"${row.email || ""}"`, `"${row.phone || ""}"`, row.age || "",
                `"${row.role || ""}"`, `"${row.track || ""}"`, `"${row.institution || ""}"`, `"${row.github || ""}"`, `"${row.linkedin || ""}"`, row.isLead ? "Lead" : "Member"
            ];
        }).map(r => r.join(","))].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `detailed_members_full_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const s: Record<string, React.CSSProperties> = {
        page: { minHeight: "100vh", background: "#f8fafc", fontFamily: '"DM Sans", sans-serif', padding: "28px 24px" },
        container: { maxWidth: 1600, margin: "0 auto" },
        header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
        title: { fontSize: 24, fontWeight: 700, color: "#0f172a" },
        btnGroup: { display: "flex", gap: 12 },
        btn: { padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "1px solid #e2e8f0", background: "#fff", color: "#0f172a", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 },
        btnPrimary: { background: "#3b82f6", color: "#fff", border: "none" },
        controls: { display: "flex", gap: 12, alignItems: "center", marginBottom: 16 },
        searchInput: { flex: 1, padding: "10px 16px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14 },
        rowsSelect: { padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, background: "#fff" },
        tableCard: { background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
        table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
        th: { background: "#f1f5f9", padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" },
        td: { padding: "12px 14px", borderBottom: "1px solid #f1f5f9", color: "#1e293b" },
        teamRow: { background: "#f8fafc", fontWeight: 700, color: "#3b82f6", fontSize: 13 },
        spacerRow: { height: 16, background: "transparent", border: "none" },
        urlText: { color: "#3b82f6", textDecoration: "none", fontSize: 11, wordBreak: "break-all" }
    };

    return (
        <div style={s.page}>
            <div style={s.container}>
                <div style={s.header}>
                    <div>
                        <h1 style={s.title}>Detailed Member View</h1>
                        <p style={{ color: "#64748b", marginTop: 4 }}>
                            Showing teams {Math.min((currentPage - 1) * rowsPerPage + 1, filteredData.length)}–{Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}
                        </p>
                    </div>
                    <div style={s.btnGroup}>
                        <Link to="/" style={s.btn}>← Back to Dashboard</Link>
                        <button onClick={downloadCSV} style={{ ...s.btn, ...s.btnPrimary }}>↓ Export ALL Detailed CSV</button>
                    </div>
                </div>

                <div style={s.controls}>
                    <input type="text" placeholder="Search members, teams, institution..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} style={s.searchInput} />
                    <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} style={s.rowsSelect}>
                        <option value={5}>5 teams / page</option>
                        <option value={10}>10 teams / page</option>
                        <option value={20}>20 teams / page</option>
                        <option value={50}>50 teams / page</option>
                    </select>
                </div>

                <div style={s.tableCard}>
                    <div style={{ overflowX: "auto" }}>
                        {loading ? (
                            <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading members data...</div>
                        ) : (
                            <>
                                <table style={s.table}>
                                    <thead>
                                        <tr>
                                            <th style={{ ...s.th, width: 60 }}>SN</th>
                                            <th style={s.th}>Name</th>
                                            <th style={s.th}>Email</th>
                                            <th style={s.th}>Phone</th>
                                            <th style={{ ...s.th, width: 40 }}>Age</th>
                                            <th style={s.th}>Role</th>
                                            <th style={s.th}>Track</th>
                                            <th style={s.th}>Institution</th>
                                            <th style={s.th}>GitHub Portfolio</th>
                                            <th style={s.th}>LinkedIn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flatRows.map((row, idx) => {
                                            if (row.type === "team") return <tr key={idx} style={s.teamRow}><td style={s.td}>{row.teamSN}</td><td colSpan={9} style={{ ...s.td, padding: "14px" }}>Team: {row.teamName}</td></tr>;
                                            if (row.type === "spacer") return <tr key={idx} style={s.spacerRow}><td colSpan={10}></td></tr>;
                                            return (
                                                <tr key={idx}>
                                                    <td style={{ ...s.td, color: "#64748b", fontWeight: 500 }}>{row.memberSN}</td>
                                                    <td style={s.td}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <span style={{ fontWeight: 600 }}>{row.name}</span>
                                                            {row.isLead && <span style={{ fontSize: 9, background: "#eff6ff", color: "#3b82f6", padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>LEAD</span>}
                                                        </div>
                                                    </td>
                                                    <td style={s.td}>{row.email || "—"}</td>
                                                    <td style={s.td}>{row.phone || "—"}</td>
                                                    <td style={s.td}>{row.age || "—"}</td>
                                                    <td style={s.td}>{row.role || "—"}</td>
                                                    <td style={s.td}>{row.track || "—"}</td>
                                                    <td style={s.td}>{row.institution || "—"}</td>
                                                    <td style={{ ...s.td, maxWidth: 200 }}>{row.github ? <a href={row.github} target="_blank" rel="noreferrer" style={s.urlText}>{row.github}</a> : "—"}</td>
                                                    <td style={{ ...s.td, maxWidth: 200 }}>{row.linkedin ? <a href={row.linkedin} target="_blank" rel="noreferrer" style={s.urlText}>{row.linkedin}</a> : "—"}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembersList;

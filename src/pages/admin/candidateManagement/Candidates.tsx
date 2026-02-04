import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BaseResponse, Candidate } from "../../../dto/Response";
import Spinner from "../../../components/Spinner";
import { HandleApiErrors, HandleApiResponse } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import { getCandidates } from "../../../services/Auth.service";

export default function Candidates() {
  
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<Array<Candidate> | null>(null);
  const [search, setSearch] = useState("");
  const [isLatestFirstFilter, setIsLatestFirstFilter] = useState<string>("latest");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  useEffect(() => {
      setLoading(true);
      let isLatestFirst = isLatestFirstFilter === 'latest' ? true :  false;
      let experienceLevel = experienceLevelFilter === 'all' ? null : experienceLevelFilter;
      getCandidates(experienceLevel, isLatestFirst, page, pageSize)
        .then((response) => {
          const result = HandleApiResponse(response);
          setCandidates(result.data ?? null);
          setLoading(false);
        })
        .catch((err: AxiosError<BaseResponse>) => {
          HandleApiErrors(err);
          setLoading(false);
        });
    }, [isLatestFirstFilter, experienceLevelFilter, page]);

  const filteredUsers = useMemo(() => {
    return candidates === null ? [] : candidates.filter((u) => {
      const matchSearch =
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [search, candidates]);
  
  return (
    <div className="cm-page">
      {/* Spinner */}
      <Spinner show={loading}/>

      {/* Header */}
      <div className="cm-header">
        <h2>Candidates</h2>
        <button className="cm-add-btn" onClick={() => navigate("/admin/candidate/add")} >
          + Add Candidate
        </button>
      </div>

      {/* Filters */}
      <div className="cm-filters">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={isLatestFirstFilter} onChange={(e) => setIsLatestFirstFilter(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>

        <select value={experienceLevelFilter} onChange={(e) => setExperienceLevelFilter(e.target.value)}>
          <option value="all">Fresher</option>
          <option value="Fresher">Fresher</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Experienced">Experienced</option>
        </select>
      </div>

      {/* Table */}
      <div className="cm-table-wrapper cm-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Experience</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="cm-empty">
                  Loading Data...
                </td>
              </tr>
            ) : candidates === null ? (
              <tr>
                <td colSpan={4} className="cm-empty">
                  No candidate record found
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="cm-empty">
                  No candidates found on current batch
                </td>
              </tr>
            ) : 
              <>
                {filteredUsers.map((candidate) => (
                  <tr
                    key={candidate.candidateId}
                    onClick={() => navigate(`/admin/candidate/detail/${candidate.candidateId}`)}
                  >
                    <td>{candidate.fullName}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone}</td>
                    <td>{candidate.candidateExperienceLevel}</td>
                  </tr>
                ))}
              </>
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="cm-pagination">
        <button onClick={() => setPage(p => p-1)} disabled={page === 1}>
          {'<'}
        </button>
        <span>{page}</span>
        <button onClick={() => setPage(p => p+1)} 
        disabled={candidates === null || candidates?.length < pageSize}>
          {'>'}
        </button>
      </div>
    </div>
  );
}

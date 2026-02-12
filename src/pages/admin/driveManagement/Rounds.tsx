import { useEffect, useMemo, useRef, useState } from "react";
import type { BaseResponse, Round } from "../../../dto/Response";
import { getInterviewRounds } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface RoundsProps {
  driveId: number;
}

export default function Rounds({ driveId }: RoundsProps) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 100;
  const listRef = useRef<HTMLDivElement>(null);

  const [interviewerSearch, setInterviewerSearch] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [roundTypeSearch, setRoundTypeSearch] = useState("");
  const [roundStatusSearch, setRoundStatusSearch] = useState("");
  const [roundResultSearch, setRoundResultSearch] = useState("");

  const fetchRounds = async (pageNumber: number) => {
    if (loading) return;
    setLoading(true);
    getInterviewRounds(driveId, null, null, null, null, pageNumber, PAGE_SIZE)
      .then((response) => {
        const result = HandleApiSuccess(response);
        if (result.data!.length < PAGE_SIZE) {
          setHasMore(false);
        }
        setRounds(prev => [...prev, ...result.data!]);
        setPage(pageNumber);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  
  useEffect(() => {
    setRounds([]);
    fetchRounds(1);
  }, [driveId]);

  const filteredRounds = useMemo(() => {
      return rounds.filter((m) => {
        const matchInterviewerSearch =
          m.userName.toLowerCase().includes(interviewerSearch.toLowerCase()) ||
          m.userEmail.toLowerCase().includes(interviewerSearch.toLowerCase());
        const matchCandidateSearch =
          m.candidateName.toLowerCase().includes(candidateSearch.toLowerCase()) ||
          m.candidateEmail.toLowerCase().includes(candidateSearch.toLowerCase());
        const matchRoundTypeSearch = 
          m.type.toLowerCase().includes(roundTypeSearch.toLowerCase());
        const matchRoundStatusSearch = 
          m.roundStatus.toLowerCase().includes(roundStatusSearch.toLowerCase());
        const matchRoundResultSearch = 
          m.roundResult.toLowerCase().includes(roundResultSearch.toLowerCase());
        return matchInterviewerSearch && matchCandidateSearch && matchRoundTypeSearch &&
            matchRoundStatusSearch && matchRoundResultSearch;
      });
    }, [interviewerSearch, candidateSearch, roundTypeSearch, roundStatusSearch, roundResultSearch, 
        rounds]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading, hasMore]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || loading || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      const nextPage = page + 1;
      fetchRounds(nextPage);
    }
  };


  return (
    <div className="ir-container">
      {/* Header */}
      <div className="ir-header">
        <input type="text" placeholder="Search by interviewer name or email" 
          value={interviewerSearch} onChange={(e) => setInterviewerSearch(e.target.value)}
        />
        <input type="text" placeholder="Search by candidate name or email" 
          value={candidateSearch} onChange={(e) => setCandidateSearch(e.target.value)}
        />
        <select value={roundTypeSearch} onChange={(e) => setRoundTypeSearch(e.target.value)}>
            <option value=''>All Round</option>
            <option value={'HR'}>HR</option>
            <option value={'Tech1'}>Technical 1</option>
            <option value={'Tech2'}>Technical 2</option>
            <option value={'Tech'}>Both Technical</option>
        </select>
        <select value={roundStatusSearch} onChange={(e) => setRoundStatusSearch(e.target.value)}>
            <option value=''>All Status</option>
            <option value={'Scheduled'}>Scheduled</option>
            <option value={'OnProcess'}>OnProcess</option>
            <option value={'Completed'}>Completed</option>
            <option value={'Skipped'}>Skipped</option>
        </select>
        <select value={roundResultSearch} onChange={(e) => setRoundResultSearch(e.target.value)}>
            <option value=''>All Result</option>
            <option value={'Pending'}>Pending</option>
            <option value={'Selected'}>Selected</option>
            <option value={'Rejected'}>Rejected</option>
        </select>
      </div>

      {/* Members list */}
      <div ref={listRef} className="ir-list">
        {filteredRounds.length === 0 && 
          <div className="ir-empty">No matched rounds found on current loaded items</div>
        }

        {filteredRounds.map(r => (
        <div key={r.roundId} className="ir-card">
            {/* Top Section */}
            <div className="ir-top">
              <div className="ir-person">
                <span className="ir-label">Candidate</span>
                <strong
                  className="ir-link"
                  onClick={() => navigate(`/admin/candidate/detail/${r.candidateId}`)}
                >
                  {r.candidateName}
                </strong>
                <div className="ir-sub">{r.candidateEmail}</div>
              </div>

              <div className="ir-person">
                <span className="ir-label">Interviewer</span>
                <strong
                  className="ir-link"
                  onClick={() => navigate(`/admin/user/detail/${r.userId}`)}
                >
                  {r.userName}
                </strong>
                <div className="ir-sub">{r.userEmail}</div>
              </div>
            </div>

            {/* Middle Section */}
            <div className="ir-middle">
              <div className="ir-chip ir-type">{r.type.replace('Tech', 'Technical ')}</div>
              <div className="ir-chip">{'>'}</div>
              <div className={`ir-chip ir-status-${r.roundStatus.toLowerCase()}`}>
                {r.roundStatus}
              </div>
              <div className="ir-chip">{'>'}</div>
              <div className={`ir-chip ir-result-${r.roundResult.toLowerCase()}`}>
                {r.roundResult}
              </div>
            </div>

            {/* Bottom Section */}
            {r.feedbackId && (
              <div className="ir-bottom">
                <button className="ir-feedback-btn"
                  onClick={() => navigate(`/admin/feedback/detail/${r.feedbackId}`)}
                >
                  View Feedback
                </button>
              </div>
            )}
        </div>
        ))}

        {loading && <div className="ir-loading">Loading...</div>}
        {!hasMore && <div className="ir-end">No more records</div>}
      </div>
    </div>
  );
}

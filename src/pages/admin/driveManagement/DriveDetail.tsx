import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { BaseResponse, Drive } from "../../../dto/Response";
import Spinner from "../../../components/Spinner";
import { editDrive, getDrive } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import { FaPencilAlt } from "react-icons/fa";
import DriveConfigDetail from "./DriveConfigDetail";
import DriveMembers from "./DriveMembers";
import DriveCandidates from "./DriveCandidates";

export default function DriveDetail() {

  const { id } = useParams<{ id: string }>();
  const driveId = Number(id);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [drive, setDrive] = useState<Drive | null>(null);
  /* Drive Edit */
  const [isEditMode, setEditMode] = useState(false);
  const [editedDrive, setEditedDrive] = useState<Drive | null>(null);
  const [driveDate, setDriveDate] = useState('');
  const [payload, setPayload] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDrive(driveId)
      .then((response) => {
        const result = HandleApiSuccess(response);
        setDrive(result.data ?? null);
        setLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setLoading(false);
      });
  }, []);

  /* Drive Edit */
  const enterEditMode = () => {
    setEditedDrive(drive); 
    setDriveDate(drive?.driveDate.split("T")[0] ?? '')
    setPayload({ driveId: drive?.driveId });
    setEditMode(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editedDrive) return;
    const { name, value, type } = e.target;
    let date: Date = new Date(editedDrive.driveDate);
    if (type === 'date') {
      setDriveDate(value);
      try { date = new Date(value); } catch {}
    }
    setEditedDrive({
      ...editedDrive,
      [name]: type === 'date' ? date.toISOString() : name === 'technicalRounds' ? Number(value) : value
    });
    setPayload({
      ...payload,
      [name]: type === 'date' ? date.toISOString() : name === 'technicalRounds' ? Number(value) : value
    });
  };

  const postDateToServer = () => {
    editDrive(payload)
      .then((response) => {
        const result = HandleApiSuccess(response);
        setDrive(result.data ?? null);
        setEditedDrive(null);
        setDriveDate('')
        setPayload({});
        setEditMode(false);
        setEditLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setEditLoading(false);
      });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    postDateToServer();
  };

  const handleCancel = () => {
    setEditedDrive(null); 
    setDriveDate('')
    setPayload({});
    setEditMode(false);
  }

  /* Drive Additional */
  const tabs = [
    { key: "config", label: "Configuration" },
    { key: "hr", label: "HR Members" },
    { key: "panel", label: "Panel Members" },
    { key: "mentor", label: "Mentors" },
    { key: "candidate", label: "Candidates" }
  ];
  const [activeTab, setActiveTab] = useState("config");


  if (loading) return (
    <>
      <Spinner show={loading}/>
      <div className="dd-loading">Loading drive detail...</div>
    </>
  );
  if (!drive) return <div className="dd-notfound">Drive not found</div>;
  return (
    <div className="drive-detail-page">
      <Spinner show={editLoading}/>

      {/* Drive */}
      <form className="drive-detail" onSubmit={handleSubmit}>
        <div className="dd-head">
          <h2>Drive Detail</h2>
          {!isEditMode && <button onClick={enterEditMode}>
            <FaPencilAlt />
          </button>}
        </div>

        <div className="dd-detail-row">
          <label>Name{isEditMode ? '*' : ''}:</label>
          {isEditMode ? (
            <input name="driveName" required value={editedDrive?.driveName ?? ''} onChange={handleChange}/>
          ) : (
            <span>{drive.driveName}</span>
          )}
        </div>

        <div className="dd-detail-row">
          <label>Date{isEditMode ? '*' : ''}:</label>
          {isEditMode ? (
            <input name="driveDate" required type="date"
            value={driveDate} 
            onChange={handleChange}/>
          ) : (
            <span>{new Date(drive.driveDate).toDateString()}</span>
          )}
        </div>

        <div className="dd-detail-row">
          <label>Technical Rounds{isEditMode ? '*' : ''}:</label>
          {isEditMode ? (
            <select name="technicalRounds" required 
            value={editedDrive?.technicalRounds ?? ''} 
            onChange={handleChange} >
              <option value={''}>Select</option>
              <option value={1}>One</option>
              <option value={2}>Two</option>
            </select>
          ) : (
            <span>{drive.technicalRounds}</span>
          )}
        </div>

        <div className="cd-detail-row">
          <label>Status{isEditMode ? '*' : ''}:</label>
          {isEditMode ? (
            <select name="driveStatus" required value={editedDrive?.driveStatus ?? ''} 
            onChange={handleChange} >
              <option value='InProposal'>InProposal</option>
              <option value='Started'>Started</option>
              <option value='Halted'>Halted</option>
              <option value='Completed'>Completed</option>
              <option value='Cancelled'>Cancelled</option>
            </select>
          ) : (
            <span className={`dm-${drive.driveStatus}`}>{drive.driveStatus}</span>
          )}
        </div>

        <div className="dd-detail-row">
          <label>Creator:</label>
          {isEditMode ? <span>{drive.creatorName}</span> :
          <span className="dd-cursor-pointer" onClick={() => navigate(`/admin/user/detail/${drive.createdBy}`)}>
              {drive.creatorName}
          </span> }
        </div>

        <div className="dd-detail-row">
          <label>Created On:</label>
          <span>{new Date(drive.createdDate).toDateString()}</span>
        </div>

        {isEditMode && (
          <div className="dd-actions">
            <button type="submit" className="btn-save">
              Save
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </form>

      {/* Drive Additional */}
      <div className="drive-detail-extra">
        <div className="dde-header">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`dde-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="dde-content">
          {activeTab === "config" && <DriveConfigDetail driveId={driveId}/>}
          {activeTab === "hr" && <DriveMembers driveId={driveId} role="HR"/>}
          {activeTab === "panel" && <DriveMembers driveId={driveId} role="Panel"/>}
          {activeTab === "mentor" && <DriveMembers driveId={driveId} role="Mentor"/>}
          {activeTab === "candidate" && <DriveCandidates driveId={driveId}/>}
        </div>
      </div>
    </div>
  );
}

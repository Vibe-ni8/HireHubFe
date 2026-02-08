import { useEffect, useState } from "react";
import type { BaseResponse, DriveConfig } from "../../../dto/Response";
import { editDriveConfig, getDriveConfig } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import Spinner from "../../../components/Spinner";
import ToggleRow from "../../../components/ToggleRow";

export default function DriveConfigDetail({driveId}:{driveId: number}) {

  const [driveConfig, setDriveConfig] = useState<DriveConfig | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    getDriveConfig(driveId)
      .then((response) => {
        const result = HandleApiSuccess(response);
        setDriveConfig(result.data ?? null);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
      });
  }, []);

  const postDateToServer = (payload: any) => {
    setEditLoading(true);
    editDriveConfig(payload)
      .then((response) => {
        const result = HandleApiSuccess(response);
        setDriveConfig(result.data ?? null);
        setEditLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setEditLoading(false);
      });
  }


  if (!driveConfig) return <div>Not found</div>;
  return (
    <div className="drive-config-detail">
      <Spinner show={editLoading} />
  
      {/* HR CONFIG */}
      <div className="dc-segment">
        <h3>HR Configuration</h3>
        <ToggleRow label="Bulk Upload"
          value={driveConfig.hrConfiguration.allowBulkUpload}
          onToggle={(v) => 
            postDateToServer({ driveId, hrConfiguration: { allowBulkUpload: v } })
          }
        />
        <ToggleRow label="Edit Feedback"
          value={driveConfig.hrConfiguration.canEditSubmittedFeedback}
          onToggle={(v) => 
            postDateToServer({ driveId, hrConfiguration: { canEditSubmittedFeedback: v } })
          }
        />
        <ToggleRow label="Reassign"
          value={driveConfig.hrConfiguration.allowPanelReassign}
          onToggle={(v) => 
            postDateToServer({ driveId, hrConfiguration: { allowPanelReassign: v } })
          }
        />
        <ToggleRow label="Reassign Approval"
          value={driveConfig.hrConfiguration.requireApprovalForReassignment}
          onToggle={(v) => 
            postDateToServer({ driveId, hrConfiguration: { requireApprovalForReassignment : v } })
          }
        />
      </div>
      
      {/* PANEL CONFIG */}
      <div className="dc-segment">
        <h3>Panel Configuration</h3>
        <ToggleRow label="Edit Feedback"
          value={driveConfig.panelConfiguration.canEditSubmittedFeedback}
          onToggle={(v) => 
            postDateToServer({ driveId, panelConfiguration: { canEditSubmittedFeedback: v } })
          }
        />
        <ToggleRow label="Reassign"
          value={driveConfig.panelConfiguration.allowPanelReassign}
          onToggle={(v) => 
            postDateToServer({ driveId, panelConfiguration: { allowPanelReassign: v } })
          }
        />
        <ToggleRow label="Reassign Approval"
          value={driveConfig.panelConfiguration.requireApprovalForReassignment}
          onToggle={(v) => 
            postDateToServer({ driveId, panelConfiguration: { requireApprovalForReassignment : v } })
          }
        />
      </div>
      
      {/* MENTOR CONFIG */}
      <div className="dc-segment">
        <h3>Mentor Configuration</h3>
        <ToggleRow label="View Feedback"
          value={driveConfig.mentorConfiguration.canViewFeedback}
          onToggle={(v) => 
            postDateToServer({ driveId, mentorConfiguration: { canViewFeedback: v } })
          }
        />
        <ToggleRow label="Reassign"
          value={driveConfig.mentorConfiguration.allowPanelReassign}
          onToggle={(v) => 
            postDateToServer({ driveId, mentorConfiguration: { allowPanelReassign: v } })
          }
        />
        <ToggleRow label="Reassign Approval"
          value={driveConfig.mentorConfiguration.requireApprovalForReassignment}
          onToggle={(v) => 
            postDateToServer({ driveId, mentorConfiguration: { requireApprovalForReassignment : v } })
          }
        />
      </div>

      {/* NOTIFICATION */}
      <div className="dc-segment">
        <h3>Notification</h3>
        <ToggleRow label="Email Notification"
          value={driveConfig.notificationSettings.emailNotificationEnabled}
          onToggle={(v) => 
            postDateToServer({ driveId, notificationSettings: { emailNotificationEnabled: v } })
          }
        />
      </div>
      
      {/* VISIBILITY */}
      <div className="dc-segment">
        <h3>Panel Visibility</h3>
        <ToggleRow label="Show Email"
          value={driveConfig.panelVisibilitySettings.showEmail}
          onToggle={(v) => 
            postDateToServer({ driveId, panelVisibilitySettings: { showEmail: v } })
          }
        />
        <ToggleRow label="Show Phone"
          value={driveConfig.panelVisibilitySettings.showPhone}
          onToggle={(v) => 
            postDateToServer({ driveId, panelVisibilitySettings: { showPhone: v } })
          }
        />
        <ToggleRow label="Show Address"
          value={driveConfig.panelVisibilitySettings.showAddress}
          onToggle={(v) => 
            postDateToServer({ driveId, panelVisibilitySettings: { showAddress: v } })
          }
        />
        <ToggleRow label="Show College"
          value={driveConfig.panelVisibilitySettings.showCollege}
          onToggle={(v) => 
            postDateToServer({ driveId, panelVisibilitySettings: { showCollege: v } })
          }
        />
        <ToggleRow label="Show Previous Company"
          value={driveConfig.panelVisibilitySettings.showPreviousCompany}
          onToggle={(v) => 
            postDateToServer({ driveId, panelVisibilitySettings: { showPreviousCompany: v } })
          }
        />
        <ToggleRow label="Show Resume Url"
          value={driveConfig.panelVisibilitySettings.showResume}
          onToggle={(v) => 
            postDateToServer({ driveId, panelVisibilitySettings: { showResume: v } })
          }
        />
        <ToggleRow label="Show LinkedIn Url"
          value={driveConfig.panelVisibilitySettings.showLinkedIn}
          onToggle={(v) => 
            postDateToServer({ driveId, panelVisibilitySettings: { showLinkedIn: v } })
          }
        />
        <ToggleRow label="Show GitHub Url"
          value={driveConfig.panelVisibilitySettings.showGitHub}
          onToggle={(v) => 
            postDateToServer({ driveId, panelVisibilitySettings: { showGitHub: v } })
          }
        />
      </div>
      
      {/* FEEDBACK */}
      <div className="dc-segment">
        <h3>Feedback Configuration</h3>
        <ToggleRow label="Overall Rating Required"
          value={driveConfig.feedbackConfiguration.overallRatingRequired}
          onToggle={(v) => 
            postDateToServer({ driveId, feedbackConfiguration: { overallRatingRequired: v } })
          }
        />
        <ToggleRow label="Technical Skill Required"
          value={driveConfig.feedbackConfiguration.technicalSkillRequired}
          onToggle={(v) => 
            postDateToServer({ driveId, feedbackConfiguration: { technicalSkillRequired: v } })
          }
        />
        <ToggleRow label="Communication Required"
          value={driveConfig.feedbackConfiguration.communicationRequired}
          onToggle={(v) => 
            postDateToServer({ driveId, feedbackConfiguration: { communicationRequired: v } })
          }
        />
        <ToggleRow label="Problem Solving Required"
          value={driveConfig.feedbackConfiguration.problemSolvingRequired}
          onToggle={(v) => 
            postDateToServer({ driveId, feedbackConfiguration: { problemSolvingRequired: v } })
          }
        />
        <ToggleRow label="Overall Feedback Required"
          value={driveConfig.feedbackConfiguration.overallFeedbackRequired}
          onToggle={(v) => 
            postDateToServer({ driveId, feedbackConfiguration: { overallFeedbackRequired: v } })
          }
        />
      </div>
    </div>
  );
}

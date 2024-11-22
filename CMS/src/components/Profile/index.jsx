import { useState, useEffect } from "react";
import axios from "axios";
import BasicInfo from "./basicInfo";
import StaffInfo from "./staffInfo";
import StudentInfo from "./studentInfo";

const Profile = ({ userType, userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/profile/${userId}`
        );
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <BasicInfo
        data={profileData.basicInfo}
        userType={userType}
        onUpdate={(updatedInfo) =>
          setProfileData({ ...profileData, basicInfo: updatedInfo })
        }
      />

      {userType === "Staff" && (
        <StaffInfo
          data={profileData.staffInfo}
          onUpdate={(updatedStaffInfo) =>
            setProfileData({ ...profileData, staffInfo: updatedStaffInfo })
          }
        />
      )}

      {userType === "Student" && (
        <StudentInfo
          data={profileData.studentInfo}
          onUpdate={(updatedStudentInfo) =>
            setProfileData({ ...profileData, studentInfo: updatedStudentInfo })
          }
        />
      )}
    </div>
  );
};

export default Profile;

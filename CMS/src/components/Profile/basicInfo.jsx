import { useState } from "react";

const BasicInfo = ({ data, userType, onUpdate }) => {
  const [mobile, setMobile] = useState(data.mobile);
  const [email, setEmail] = useState(data.email);
  const [profilePhoto, setProfilePhoto] = useState(data.profilePhoto);

  const handleSave = () => {
    const updatedInfo = { ...data, mobile, email, profilePhoto };
    onUpdate(updatedInfo);
    // Call API to save changes
  };

  return (
    <div className="basic-info mb-6">
      <h3 className="text-lg font-bold">Basic Info</h3>
      <p>User Type: {userType}</p>
      <p>Username: {data.username}</p>
      <p>Name: {data.name}</p>
      <div>
        <label>Mobile: </label>
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      <div>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Profile Photo: </label>
        <input
          type="file"
          onChange={(e) => setProfilePhoto(e.target.files[0])}
        />
      </div>
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2">
        Save Changes
      </button>
    </div>
  );
};

export default BasicInfo;

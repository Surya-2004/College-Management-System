import { useState } from "react";

const StaffInfo = ({ data, onUpdate }) => {
  const [subjects, setSubjects] = useState(data.subjects);

  const handleUpdateSubject = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleSave = () => {
    onUpdate({ subjects });
    // Call API to save changes
  };

  return (
    <div className="staff-info mb-6">
      <h3 className="text-lg font-bold">Staff Info</h3>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Class</th>
            <th>Subject</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={subject.class}
                  onChange={(e) =>
                    handleUpdateSubject(index, "class", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={subject.subject}
                  onChange={(e) =>
                    handleUpdateSubject(index, "subject", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2">
        Save Changes
      </button>
    </div>
  );
};

export default StaffInfo;

import { useState } from "react";

const StudentInfo = ({ data, onUpdate }) => {
  const [linkedIn, setLinkedIn] = useState(data.linkedIn);
  const [github, setGithub] = useState(data.github);
  const [portfolio, setPortfolio] = useState(data.portfolio);
  const [skills, setSkills] = useState(data.skills);

  const handleAddSkill = (skill) => {
    setSkills((prevSkills) => [...prevSkills, skill]);
  };

  const handleRemoveSkill = (skill) => {
    setSkills((prevSkills) => prevSkills.filter((s) => s !== skill));
  };

  const handleSave = () => {
    onUpdate({ linkedIn, github, portfolio, skills });
    // Call API to save changes
  };

  return (
    <div className="student-info mb-6">
      <h3 className="text-lg font-bold">Student Info</h3>
      <div>
        <label>LinkedIn: </label>
        <input
          type="url"
          value={linkedIn}
          onChange={(e) => setLinkedIn(e.target.value)}
        />
      </div>
      <div>
        <label>GitHub: </label>
        <input
          type="url"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />
      </div>
      <div>
        <label>Portfolio: </label>
        <input
          type="url"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
        />
      </div>
      <div>
        <label>Skills: </label>
        <select
          onChange={(e) => handleAddSkill(e.target.value)}
          value=""
        >
          <option value="" disabled>
            Add Skill
          </option>
          <option value="JavaScript">JavaScript</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
        </select>
        <ul>
          {skills.map((skill) => (
            <li key={skill}>
              {skill}{" "}
              <button onClick={() => handleRemoveSkill(skill)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2">
        Save Changes
      </button>
    </div>
  );
};

export default StudentInfo;

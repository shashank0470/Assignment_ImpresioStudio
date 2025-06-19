// src/components/SectionHeader.jsx
const SectionHeader = ({ title, section, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
    {children}
  </div>
);

export default SectionHeader;

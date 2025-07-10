import React from 'react';

interface CompanyTileProps {
  id: string;
  name: string;
  location: string;
  status: string;
  statusColor: string;
  selected: boolean;
  onSelect: (id: string) => void;
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

const CompanyTile: React.FC<CompanyTileProps> = ({
  id,
  name,
  location,
  status,
  statusColor,
  selected,
  onSelect,
  onClick,
  children,
  className = ""
}) => {
  return (
    <div 
      className={`border border-gray-300 p-3 cursor-pointer hover:bg-gray-50 ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(id)}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{location}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs ${statusColor}`}>
          {status}
        </span>
      </div>
      {children}
    </div>
  );
};

export default CompanyTile; 
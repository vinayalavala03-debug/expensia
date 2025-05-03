import React from 'react';
import { getInitials } from '../../utils/helper';

const CharAvatar = ({ fullName, width, height, style }) => {
  return (
    <div
      className={`${width || 'w-12'} ${height || 'h-12'} ${
        style || 'text-2xl'
      } bg-primary rounded-full text-gray-900 font-medium flex items-center justify-center`}
    >
      {getInitials(fullName || '')}
    </div>
  );
};

export default CharAvatar;

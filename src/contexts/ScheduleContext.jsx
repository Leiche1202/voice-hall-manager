import React, { createContext, useState } from 'react';

export const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [schedule, setSchedule] = useState(
    Array.from({ length: 24 }, () => ({ 备档: '', 主档: '', 陪档: '' }))
  );
  const [scheduleId, setScheduleId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  return (
    <ScheduleContext.Provider
      value={{
        schedule,
        setSchedule,
        scheduleId,
        setScheduleId,
        isSaving,
        setIsSaving,
        saveStatus,
        setSaveStatus,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

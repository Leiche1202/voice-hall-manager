import { useContext, useState, useEffect } from 'react';
import { ScheduleContext } from '../contexts/ScheduleContext';
import { useApi } from '../contexts/ApiContext';

export function useSchedule() {
  const {
    schedule,
    setSchedule,
    scheduleId,
    setScheduleId,
    isSaving,
    setIsSaving,
    saveStatus,
    setSaveStatus,
  } = useContext(ScheduleContext);
  const { saveSchedule, getSchedule } = useApi();

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const result = await getSchedule(today);
        if (result) {
          setScheduleId(result.id);
          setSchedule(result.details || []);
        }
      } catch (error) {
        console.error('Failed to load schedule:', error);
        setSaveStatus(`加载失败：${error.message}`);
      }
    };
    loadSchedule();
  }, [getSchedule, setSchedule, setScheduleId, setSaveStatus]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('正在保存...');
    try {
      const today = new Date().toISOString().split('T')[0];
      const id = await saveSchedule({
        id: scheduleId,
        date: today,
        details: schedule,
        status: 'published',
      });
      if (!scheduleId && id) {
        setScheduleId(id);
      }
      setSaveStatus('档表已成功保存！');
    } catch (error) {
      console.error('Failed to save schedule:', error);
      setSaveStatus(`保存失败：${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    schedule,
    setSchedule,
    scheduleId,
    isSaving,
    saveStatus,
    handleSave,
    setSaveStatus,
  };
}

import React, { useState, useEffect } from 'react';

export interface DeadlineInfo {
  isOverdue: boolean;
  isUrgent24h: boolean; // < 24 hours left
  remainingMs: number;
  formattedCountdown: string;
  badgeText: string;
  badgeStyle: 'red' | 'yellow' | 'normal' | 'submitted';
}

export function parseDueAt(assignment: { dueDate?: string; dueTime?: string; dueAt?: string }): Date {
  if (assignment.dueAt) {
    const d = new Date(assignment.dueAt);
    if (!isNaN(d.getTime())) return d;
  }
  if (assignment.dueDate) {
    const time = assignment.dueTime || '23:59';
    const cleanTime = time.includes(':') ? time : `${time}:00`;
    const d = new Date(`${assignment.dueDate}T${cleanTime.length === 5 ? cleanTime + ':00' : cleanTime}`);
    if (!isNaN(d.getTime())) return d;
    const fallback = new Date(assignment.dueDate);
    if (!isNaN(fallback.getTime())) return fallback;
  }
  return new Date();
}

export function getDeadlineInfo(
  assignment: { status: string; dueDate?: string; dueTime?: string; dueAt?: string; submittedAt?: string },
  now: number = Date.now(),
  language: 'th' | 'en' = 'th'
): DeadlineInfo {
  const isThai = language === 'th';
  if (assignment.status === 'submitted' || assignment.status === 'completed') {
    return {
      isOverdue: false,
      isUrgent24h: false,
      remainingMs: 0,
      formattedCountdown: isThai ? 'ส่งงานแล้ว' : 'Submitted',
      badgeText: isThai ? 'ส่งแล้ว' : 'Submitted',
      badgeStyle: 'submitted',
    };
  }

  const deadline = parseDueAt(assignment).getTime();
  const diff = deadline - now;
  const isOverdue = diff < 0;
  const isUrgent24h = diff >= 0 && diff <= 24 * 60 * 60 * 1000;

  const absDiff = Math.abs(diff);
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

  let formattedCountdown = '';
  if (isOverdue) {
    if (days > 0) {
      formattedCountdown = isThai
        ? `เลยกำหนดมาแล้ว ${days} วัน ${hours} ชม. ${minutes} นาที`
        : `Overdue by ${days}d ${hours}h ${minutes}m`;
    } else {
      formattedCountdown = isThai
        ? `เลยกำหนดมาแล้ว ${hours} ชม. ${minutes} นาที ${seconds} วิ`
        : `Overdue by ${hours}h ${minutes}m ${seconds}s`;
    }
  } else {
    if (days > 0) {
      formattedCountdown = isThai
        ? `เหลืออีก ${days} วัน ${hours} ชม. ${minutes} นาที`
        : `${days}d ${hours}h ${minutes}m left`;
    } else {
      formattedCountdown = isThai
        ? `เหลืออีก ${hours} ชม. ${minutes} นาที ${seconds} วิ`
        : `${hours}h ${minutes}m ${seconds}s left`;
    }
  }

  let badgeText = '';
  let badgeStyle: 'red' | 'yellow' | 'normal' | 'submitted' = 'normal';

  if (isOverdue) {
    badgeText = isThai ? '⚠️ เลยกำหนดส่งแล้ว' : '⚠️ Overdue';
    badgeStyle = 'red';
  } else if (isUrgent24h) {
    badgeText = isThai ? '⚡ ใกล้ครบกำหนด (< 24 ชม.)' : '⚡ Due Soon (< 24h)';
    badgeStyle = 'yellow';
  } else {
    badgeText = isThai ? 'ยังไม่ส่ง' : 'Pending';
    badgeStyle = 'normal';
  }

  return {
    isOverdue,
    isUrgent24h,
    remainingMs: diff,
    formattedCountdown,
    badgeText,
    badgeStyle,
  };
}

/**
 * Hook that returns current time updated every second for live countdown
 */
export function useLiveTimer() {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return now;
}

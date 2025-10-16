import React from 'react';

export default function MilestoneChart({ milestones }) {
  const completed = milestones.filter(m => m.done).length;
  return (
    <div className="chart">
      <h4>🎯 Milestone Progress</h4>
      <p>{completed}/{milestones.length} milestones completed</p>
      <progress value={completed} max={milestones.length}></progress>
    </div>
  );
}

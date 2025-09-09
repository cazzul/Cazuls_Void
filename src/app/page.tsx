"use client";

import RecordsTable from "@/components/records-table";

export default function Home() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-accent)' }}>RECORDS</h2>
      </header>

      {/* Records Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
            All-Time Workout Records
          </h1>
          <p style={{ color: 'var(--color-secondary)' }}>
            Track every working set you've ever completed. Sort, filter, and search through your complete workout history.
          </p>
        </div>

        {/* Records Table */}
        <RecordsTable />
      </div>
    </>
  );
}

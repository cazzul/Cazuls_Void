"use client";

import RecordsTable from "@/components/records-table";

export default function Home() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'oklch(0.269 0 0)', backgroundColor: 'oklch(0.145 0 0)' }}>
        <h2 className="text-xl font-semibold" style={{ color: 'oklch(0.488 0.243 264.376)' }}>RECORDS</h2>
      </header>

      {/* Records Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.488 0.243 264.376)' }}>
            All-Time Workout Records
          </h1>
          <p style={{ color: 'oklch(0.708 0 0)' }}>
            Track every working set you've ever completed. Sort, filter, and search through your complete workout history.
          </p>
        </div>

        {/* Records Table */}
        <RecordsTable />
      </div>
    </>
  );
}

'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '12px 16px' }}>
          <div className="h-4 rounded skeleton" />
        </td>
      ))}
    </tr>
  );
}

function DataRow<T extends Record<string, unknown>>({
  row,
  columns,
  keyField,
  onRowClick,
}: {
  row: T;
  columns: Column<T>[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      key={String(row[keyField])}
      onClick={() => onRowClick?.(row)}
      style={{
        background: hovered ? 'var(--bg-secondary)' : 'var(--bg-card)',
        cursor: onRowClick ? 'pointer' : undefined,
        transition: 'background 0.18s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {columns.map((col) => (
        <td
          key={col.key}
          className={cn(col.className)}
          style={{
            padding: '12px 16px',
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--border)',
            fontSize: 14,
          }}
        >
          {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  loading = false,
  emptyMessage = 'No records found.',
  className,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div
      className={cn('w-full overflow-x-auto', className)}
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}
    >
      <table className="w-full text-sm">
        <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(col.headerClassName)}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '48px 16px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg
                    style={{ width: 40, height: 40, color: 'var(--border)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <DataRow
                key={String(row[keyField])}
                row={row}
                columns={columns}
                keyField={keyField}
                onRowClick={onRowClick}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
